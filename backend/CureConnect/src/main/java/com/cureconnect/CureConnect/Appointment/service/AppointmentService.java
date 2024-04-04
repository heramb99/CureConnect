package com.cureconnect.CureConnect.Appointment.service;

import com.cureconnect.CureConnect.Appointment.Model.Appointment;
import com.cureconnect.CureConnect.Appointment.Repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AppointmentService implements IAppointmentService {

    @Autowired
    AppointmentRepository appointmentRepository;
    @Autowired
    MongoTemplate mongoTemplate;

    @Override
    public boolean addAppointments(List<Appointment> appointmentList) {
        appointmentRepository.saveAll(appointmentList);
        return true;
    }

    @Override
    public boolean deleteAppointment(String id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            appointmentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Map<Long, List<Appointment>> getAppointmentsByDate(String doctorId) {
        Map<Long, List<Appointment>> appointmentMap = new HashMap<>();

        List<Appointment> appointmentList = appointmentRepository.findByDoctorId(doctorId);

        for (Appointment appointment : appointmentList) {
            Long dateValue = appointment.getAppointmentDate();
            List<Appointment> appointments = appointmentMap.getOrDefault(dateValue, new ArrayList<>());
            appointments.add(appointment);
            appointmentMap.put(dateValue, appointments);
        }

        return appointmentMap;
    }

    @Override
    public List<Appointment> getAppointmentsByDoctor(String doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    @Override
    public List<Appointment> getAppointmentsByUserId(String userId) {
        return appointmentRepository.findByPatientId(userId);
    }

    @Override
    public Map<Long, List<Appointment>> getAvailableAppointmentFromToday(String doctorId) {
        long currentMillis = System.currentTimeMillis();
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        long todayMillis = startOfDay.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        Map<Long, List<Appointment>> appointmentMap = getAppointmentsByDate(doctorId);
        appointmentMap = appointmentMap.entrySet().stream().filter(appointment -> appointment.getKey() >= todayMillis).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        return appointmentMap.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey,
                        entry -> entry.getValue().stream()
                                .filter(appointment -> !appointment.isBooked() && appointment.getStart() > currentMillis)
                                .collect(Collectors.toList())));
    }

    @Override
    public Appointment getAppointment(String id) {
        Optional<Appointment> optional = appointmentRepository.findById(id);
        return optional.orElse(null);
    }


    @Override
    public boolean updateAppointment(Appointment appointment) {
        appointment.setPatientName("John Doe");
        appointmentRepository.save(appointment);
        return true;
    }

    public int getNumberOfAppointmentsCompleted(String doctorId) {
        long currentMillis = System.currentTimeMillis();
        List<Appointment> completedAppointments = appointmentRepository.findByDoctorIdAndStartLessThanAndBooked(doctorId, currentMillis, true);
        return completedAppointments.size();
    }

    public int getNumberOfDistinctPatientsTreated(String doctorId) {
        long currentMillis = System.currentTimeMillis();
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndStartLessThanAndBooked(doctorId, currentMillis, true);
        Set<String> distinctPatientIds = appointments.stream()
                .map(Appointment::getPatientId)
                .collect(Collectors.toSet());
        return distinctPatientIds.size();
    }

    @Override
    public Double getTotalAmountEarnedForCurrentMonth(String doctorId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfMonth = now.with(TemporalAdjusters.lastDayOfMonth()).withHour(23).withMinute(59).withSecond(59).withNano(999999999);

        long startOfMonthMillis = startOfMonth.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        long endOfMonthMillis = now.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndStartBetweenAndBooked(doctorId, startOfMonthMillis, endOfMonthMillis, true);

        return appointments.stream()
                .mapToDouble(Appointment::getPrice)
                .sum();
    }

    @Override
    public Double getTotalAmountEarnedTillDate(String doctorId) {
        LocalDateTime currentDate = LocalDateTime.now();
//        LocalDateTime startOfDate = currentDate.withHour(0).withMinute(0).withSecond(0).withNano(0);

        long startOfDateMillis = currentDate.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndStartLessThanEqualAndBooked(doctorId, startOfDateMillis, true);

        return appointments.stream()
                .mapToDouble(Appointment::getPrice)
                .sum();
    }
    public List<Appointment> getFutureAppointmentsByDoctorIdAndPatientId(String doctorId,String patientId){
        LocalDateTime currentDate = LocalDateTime.now();
        long currentDateInMillis = currentDate.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        return appointmentRepository.findByDoctorIdAndPatientIdAndStartGreaterThanEqualAndBooked(doctorId,patientId,currentDateInMillis,true);
    }
   public List<Appointment> getPastAppointmentsByDoctorIdAndPatientId(String doctorId,String patientId){
       LocalDateTime currentDate = LocalDateTime.now();
       long currentDateInMillis = currentDate.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
       return appointmentRepository.findByDoctorIdAndPatientIdAndStartLessThanEqualAndBooked(doctorId,patientId,currentDateInMillis,true);
   }
}

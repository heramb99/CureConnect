package com.cureconnect.CureConnect.Appointment.Controller;

import com.cureconnect.CureConnect.Appointment.Model.Appointment;
import com.cureconnect.CureConnect.Appointment.Response.AppointmentResponse;
import com.cureconnect.CureConnect.Appointment.service.IAppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/appointment")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    IAppointmentService appointmentService;
    @PostMapping("/addAppointments")
    public ResponseEntity<AppointmentResponse> addAppointments(@RequestBody List<Appointment> appointments) {
        if (appointmentService.addAppointments(appointments)) {
            return ResponseEntity.ok(AppointmentResponse.builder().status("success").message("All Appointment Added").build());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(AppointmentResponse.builder().status("failure").message("Unable to add slots").build());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<AppointmentResponse> updateAppointment(@RequestBody Appointment appointment) {
        appointmentService.updateAppointment(appointment);
        return ResponseEntity.ok(AppointmentResponse.builder().status("success").message("Appointment Updated Successfully").build());
    }

    @DeleteMapping("/deleteById/{id}")
    public ResponseEntity<AppointmentResponse> deleteAppointmentById(@PathVariable String id) {
        if (appointmentService.deleteAppointment(id)) {
            return ResponseEntity.ok(AppointmentResponse.builder().status("success").message("Appointment Deleted!").build());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(AppointmentResponse.builder().status("failure").message("Appointment not found").build());
        }
    }

    @GetMapping("/getAppointmentByDate/{doctorId}")
    public ResponseEntity<AppointmentResponse> getAppointmentsByDate(@PathVariable String doctorId) {
        Map<Long, List<Appointment>> appointmentMap = appointmentService.getAppointmentsByDate(doctorId);
        return ResponseEntity.ok(AppointmentResponse.builder().status("success").message("Appointments fetched by date").appointmentMapByDate(appointmentMap).build());
    }

    @GetMapping("/getAllAppointment/{doctorId}")
    public ResponseEntity<AppointmentResponse> getAppointmentsByDoctor(@PathVariable String doctorId) {
        List<Appointment> appointmentList = appointmentService.getAppointmentsByDoctor(doctorId);

        //sort by date
        Collections.sort(appointmentList, Comparator.comparing(Appointment::getStart).reversed());
        return ResponseEntity.ok(AppointmentResponse.builder().status("success").message("Appointment fetched by doctor").appointmentList(appointmentList).build());
    }

    @GetMapping("/patient/{userId}")
    public List<Appointment> getAppointmentsByUserId(@PathVariable String userId) {
        return appointmentService.getAppointmentsByUserId(userId);
    }

    @GetMapping("/getAppointmentFromToday/{doctorId}")
    public ResponseEntity<AppointmentResponse> getAppointmentFromToday(@PathVariable String doctorId) {
        Map<Long, List<Appointment>> appointmentMap = appointmentService.getAvailableAppointmentFromToday(doctorId);
        return ResponseEntity.ok(AppointmentResponse.builder().status("success").message("Appointment Fetched!").appointmentMapByDate(appointmentMap).build());
    }

    @PutMapping("/updatePrescription")
    public ResponseEntity<AppointmentResponse> updatePrescription(@RequestBody Appointment appointment) {
        Appointment fetchedAppointment = appointmentService.getAppointment(appointment.getId());
        if (Objects.isNull(fetchedAppointment)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(AppointmentResponse.builder().status("failed").message("Appointment Not Found!").build());
        }
        fetchedAppointment.setPrescriptionList(appointment.getPrescriptionList());
        appointmentService.updateAppointment(fetchedAppointment);
        return ResponseEntity.ok(AppointmentResponse.builder().status("success").message("Appointment Updated Successfully").build());
    }

    @GetMapping("/getAppointmentsCompleted/{doctorId}")
    public ResponseEntity<AppointmentResponse> getAppointmentsCompleted(@PathVariable String doctorId) {
        int numberOfAppointments = appointmentService.getNumberOfAppointmentsCompleted(doctorId);
        return ResponseEntity.ok(AppointmentResponse.builder().status("success").message("Appointment Count Fetched!").numberOfAppointmentsCompleted(numberOfAppointments).build());
    }

    @GetMapping("/getPatientsTreated/{doctorId}")
    public ResponseEntity<AppointmentResponse> getPatientsCompleted(@PathVariable String doctorId) {
        int numberOfPatients = appointmentService.getNumberOfDistinctPatientsTreated(doctorId);
        return ResponseEntity.ok(AppointmentResponse.builder().status("success").message("Patient Count Fetched!").numberOfPatientsTreated(numberOfPatients).build());
    }

    @GetMapping("/getEarningForMonth/{doctorId}")
    public ResponseEntity<AppointmentResponse> getEarningForMonth(@PathVariable String doctorId) {
        Double earned = appointmentService.getTotalAmountEarnedForCurrentMonth(doctorId);
        return ResponseEntity.ok(AppointmentResponse.builder().status("success").message("Earning for month Fetched!").earningsForMonth(earned).build());
    }

    @GetMapping("/getTotalEarnings/{doctorId}")
    public ResponseEntity<AppointmentResponse> getTotalEarnings(@PathVariable String doctorId) {
        Double earned = appointmentService.getTotalAmountEarnedTillDate(doctorId);
        return ResponseEntity.ok(AppointmentResponse.builder().status("success").message("Total Earnings Fetched!").totalEarnings(earned).build());
    }
}

package com.cureconnect.CureConnect.doctors.controller;

import com.cureconnect.CureConnect.doctors.model.Doctor;
import com.cureconnect.CureConnect.doctors.service.DoctorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController()
@RequestMapping("/api/v1/doctor")
@CrossOrigin(originPatterns = "*")
public class DoctorController {
    Logger logger = LoggerFactory.getLogger(DoctorController.class);

    @Autowired
    DoctorService doctorService;

    @PostMapping("/register")
    @PreAuthorize("hasAuthority('ROLE:DOCTOR')")
    public ResponseEntity<Doctor> register(@RequestBody Doctor doctor) {

        Doctor responseDoctor = doctorService.registerDoctor(doctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDoctor);
    }

    @GetMapping("/getAllApprovedDoctors")
    @PreAuthorize("hasAuthority('ROLE:PATIENT') or hasAuthority('ROLE:DOCTOR')")
    public ResponseEntity<List<Doctor>> getAllApprovedDoctors() {
        List<Doctor> doctorList = doctorService.getAllApprovedDoctors();
        return ResponseEntity.status(HttpStatus.OK).body(doctorList);
    }

    @GetMapping("/getDoctor/{doctorId}")
    public ResponseEntity<Doctor> getDoctor(@PathVariable String doctorId) {
        Doctor doctor = doctorService.findById(doctorId);
        return ResponseEntity.status(HttpStatus.OK).body(doctor);
    }

    @GetMapping("/patients")
    @PreAuthorize("hasAuthority('ROLE:DOCTOR')")
    public ResponseEntity getPatients(@AuthenticationPrincipal Jwt jwt) {
        return doctorService.getPatients(jwt.getSubject());
    }

    @GetMapping("/patients/{patientId}/appointments")
    @PreAuthorize("hasAuthority('ROLE:DOCTOR')")
    public ResponseEntity getPatientsAppointments(@AuthenticationPrincipal Jwt jwt, @PathVariable String patientId) {
        System.out.println("Patient ID -> " + patientId);
        return doctorService.getPatientsAppointments(jwt.getSubject(), patientId);
    }

}

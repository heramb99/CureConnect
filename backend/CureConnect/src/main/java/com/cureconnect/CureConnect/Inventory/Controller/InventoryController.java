package com.cureconnect.CureConnect.Inventory.Controller;

import com.cureconnect.CureConnect.Inventory.Model.Medicine;
import com.cureconnect.CureConnect.Inventory.Responses.InventoryResponse;
import com.cureconnect.CureConnect.Inventory.service.IMedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    IMedicineService medicineService;

    @GetMapping("/all")
    public ResponseEntity<InventoryResponse> getAllMedicine() {
        return ResponseEntity.ok(InventoryResponse.builder().medicineList(medicineService.getAllMedicines()).message("All Medicine's retrieved").status("Success").build());
    }

    @PostMapping("/add")
    public ResponseEntity<InventoryResponse> addMedicine(@RequestBody Medicine medicine) {
        System.out.println(medicine);
        Boolean status = medicineService.addMedicine(medicine);
        if (status) {
            return ResponseEntity.ok(InventoryResponse.builder().status("success").message("Medicine Successfully Added").build());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(InventoryResponse.builder().status("failed").message("Server encountered problem").build());
    }

    @RequestMapping(path = "/multipleAdd", method = RequestMethod.POST,
            consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<InventoryResponse> addMultipleMedicine(@RequestParam("uploadedFiles") MultipartFile[] files) {
        Map<String, Boolean> uploadStatus = new HashMap<>();
        Arrays.stream(files).sequential().forEach(file -> {
            try {
                Boolean status = medicineService.addMultipleMedicines(file);
                uploadStatus.put(file.getOriginalFilename(), status);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
        return ResponseEntity.ok(InventoryResponse.builder().status("success").message("Medicine Successfully Added").uploadStatus(uploadStatus).build());
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<InventoryResponse> deleteMedicine(@PathVariable("id") String id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok(InventoryResponse.builder().status("success").message("Medicine Successfully Deleted").build());
    }

    @GetMapping(path = "/fetchAll")
    public ResponseEntity<InventoryResponse> fetchAllByNames(@RequestParam("medicines") String[] medicines) {
        return ResponseEntity.ok(InventoryResponse.builder().medicineList(medicineService.getMedicinesByName(medicines)).status("success").message("Medicine Successfully Retrieved").build());
    }

    @PutMapping(path = "/updateInventory")
    public ResponseEntity<InventoryResponse> updateByNames(@RequestBody List<Medicine> medicines) {
        medicineService.updateMedicines(medicines);
        return ResponseEntity.ok(InventoryResponse.builder().status("success").message("Updated Inventory").build());
    }
}

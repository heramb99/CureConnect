package com.cureconnect.CureConnect.Inventory.service;

import com.cureconnect.CureConnect.Inventory.Model.Medicine;
import com.cureconnect.CureConnect.Inventory.Repository.MedicineRepository;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.*;

@Service
public class MedicineService implements IMedicineService {

    private static final List<String> columnNames = Arrays.asList("medicine", "brand", "price", "quantity", "description", "expiry date");

    @Autowired
    MedicineRepository medicineRepository;

    @Override
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    @Override
    public boolean addMedicine(Medicine newMedicine) {
        medicineRepository.save(newMedicine);
        return true;
    }

    public boolean addMultipleMedicines(MultipartFile file) throws IOException {
        if ("xlsx".equalsIgnoreCase(Objects.requireNonNull(file.getOriginalFilename()).substring(file.getOriginalFilename().lastIndexOf(".") + 1))) {
            Workbook workbook = new XSSFWorkbook(file.getInputStream());
            for (Sheet sheet : workbook) {
                Map<String, Integer> columnMapping = new HashMap<>();
                Row headerRow = sheet.getRow(0);
                for (String column : columnNames) {
                    boolean flag = false;
                    for (int i = 0; i < headerRow.getLastCellNum(); i++) {
                        if (column.equalsIgnoreCase(headerRow.getCell(i).toString())) {
                            columnMapping.put(column, i);
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        return false;
                    }
                }

                for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                    Row row = sheet.getRow(i);
                    Medicine.MedicineBuilder medicine = Medicine.builder().name(row.getCell(columnMapping.get("medicine")).toString())
                            .brand(row.getCell(columnMapping.get("brand")).toString())
                            .expiryDate(row.getCell(columnMapping.get("expiry date")).toString())
                            .quantity((int) Double.parseDouble(row.getCell(columnMapping.get("quantity")).toString()))
                            .price(Double.parseDouble(row.getCell(columnMapping.get("price")).toString()));
                    medicine.description(columnMapping.containsKey("description") ? row.getCell(columnMapping.get("description")).toString() : "No Description Available");
                    addMedicine(medicine.build());
                }
            }
        } else if ("csv".equalsIgnoreCase(Objects.requireNonNull(file.getOriginalFilename()).substring(file.getOriginalFilename().lastIndexOf(".") + 1))) {
            List<Medicine> medicineList = convertToModel(file);
            medicineRepository.saveAll(medicineList);
        } else {
            return false;
        }
        return true;
    }

    @Override
    public void deleteMedicine(String id) {
        Medicine.builder().id(id).build();
        medicineRepository.delete(Medicine.builder().id(id).build());
    }

    @Override
    public List<Medicine> getMedicinesByName(String[] medicines) {
        List<Medicine> allMedicines = getAllMedicines();
        List<Medicine> listOfMedicinesNeeded = new ArrayList<>();
        Arrays.stream(medicines).forEach(medicine -> {
            List<Medicine> fetchedMedicine = allMedicines.stream().filter(med -> medicine.equalsIgnoreCase(med.getName())).toList();
            Integer totalQuantity = fetchedMedicine.stream().map(Medicine::getQuantity).reduce(0, Integer::sum);
            OptionalDouble optionalPrice = fetchedMedicine.stream().mapToDouble(Medicine::getPrice).average();
            double price = 0.0;
            if (optionalPrice.isPresent()) {
                price = optionalPrice.getAsDouble();
            }
            Medicine newMedicine = Medicine.builder().quantity(totalQuantity).name(medicine).price(price).build();
            listOfMedicinesNeeded.add(newMedicine);
        });
        return listOfMedicinesNeeded;
    }

    @Override
    public boolean updateMedicines(List<Medicine> medicines) {
        medicines.forEach(medicine -> {
            int quantity = medicine.getQuantity();
            List<Medicine> medicineList = medicineRepository.findByName(medicine.getName());
            for (Medicine fetchedMedicine : medicineList) {
                if (quantity > 0) {
                    if (fetchedMedicine.getQuantity() >= quantity) {
                        fetchedMedicine.setQuantity(fetchedMedicine.getQuantity() - quantity);
                        medicineRepository.save(fetchedMedicine);
                        break;
                    } else {
                        quantity -= fetchedMedicine.getQuantity();
                        fetchedMedicine.setQuantity(0);
                        medicineRepository.save(fetchedMedicine);
                    }
                }
            }
        });
        return true;
    }

    private static <T> List<T> convertToModel(MultipartFile file) throws IOException {
        Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
        CsvToBean<Medicine> csvReader = new CsvToBeanBuilder(reader)
                .withType(Medicine.class)
                .withSeparator(',')
                .withIgnoreLeadingWhiteSpace(true)
                .withIgnoreEmptyLine(true)
                .build();
        return (List<T>) csvReader.parse();
    }
}

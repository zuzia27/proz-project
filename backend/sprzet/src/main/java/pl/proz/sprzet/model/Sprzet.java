package pl.proz.sprzet.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Sprzet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String model;
    private String type;
    private String serialNumber;
    private String location;

    @Enumerated(EnumType.STRING)
    private StatusSprzetu status;

    private LocalDate nextInspectionDate;

    public Sprzet() {
    }

    // GETTERY / SETTERY – wygeneruj:
    // w IntelliJ: Alt + Insert → Getter and Setter → zaznacz wszystkie pola → OK

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public StatusSprzetu getStatus() {
        return status;
    }

    public void setStatus(StatusSprzetu status) {
        this.status = status;
    }

    public LocalDate getNextInspectionDate() {
        return nextInspectionDate;
    }

    public void setNextInspectionDate(LocalDate nextInspectionDate) {
        this.nextInspectionDate = nextInspectionDate;
    }

}

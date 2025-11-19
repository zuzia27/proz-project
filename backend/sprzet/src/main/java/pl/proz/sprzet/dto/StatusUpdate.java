package pl.proz.sprzet.dto;

import pl.proz.sprzet.model.StatusSprzetu;
import java.time.LocalDate;

public class StatusUpdate {
    private StatusSprzetu status;
    private LocalDate nextInspectionDate;

    public StatusSprzetu getStatus() { return status; }
    public void setStatus(StatusSprzetu status) { this.status = status; }
    public LocalDate getNextInspectionDate() { return nextInspectionDate; }
    public void setNextInspectionDate(LocalDate nextInspectionDate) { this.nextInspectionDate = nextInspectionDate; }
}

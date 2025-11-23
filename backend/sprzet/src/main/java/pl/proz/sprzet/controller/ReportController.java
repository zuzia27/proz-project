package pl.proz.sprzet.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pl.proz.sprzet.model.Sprzet;
import pl.proz.sprzet.model.StatusSprzetu;
import pl.proz.sprzet.report.PdfReportService;
import pl.proz.sprzet.service.SprzetService;

import java.io.ByteArrayOutputStream;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // albo 5173 jeśli tak odpalasz front
@RequiredArgsConstructor
public class ReportController {

    private final SprzetService sprzetService;
    private final PdfReportService pdfReportService;

    @GetMapping("/raport")
    public ResponseEntity<byte[]> raport(
            @RequestParam(required = false) StatusSprzetu status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false, name = "type") String type,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) throws Exception {

        List<Sprzet> data = sprzetService.listFiltered(status, location, type, sortBy, sortDir);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        pdfReportService.generateEquipmentReport(data, baos);
        byte[] bytes = baos.toByteArray();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename("raport_sprzetu.pdf")
                        .build()
        );
        headers.setContentLength(bytes.length);

        return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
    }
}

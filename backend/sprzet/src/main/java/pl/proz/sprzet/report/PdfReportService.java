package pl.proz.sprzet.report;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import pl.proz.sprzet.model.Sprzet;

import java.io.OutputStream;
import java.net.URL;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.awt.Color;


@Service
public class PdfReportService {

    private static final DateTimeFormatter DF = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private Font font(float size, int style) throws Exception {
        // rejestruj czcionkę z resources/fonts
        ClassPathResource res = new ClassPathResource("fonts/NotoSans-Regular.ttf");
        URL url = res.getURL(); // URL działa z FontFactory
        FontFactory.register(url.toString(), "NotoSans");
        return FontFactory.getFont("NotoSans", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, size, style);
    }

    public void generateEquipmentReport(List<Sprzet> items, OutputStream out) throws Exception {
        Document doc = new Document(PageSize.A4.rotate(), 36, 36, 36, 36);
        PdfWriter.getInstance(doc, out);
        doc.open();

        // Tytuł
        Paragraph title = new Paragraph("Raport – Ewidencja Sprzętu Medycznego", font(16, Font.BOLD));
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(16f);
        doc.add(title);

        Paragraph meta = new Paragraph("Łącznie pozycji: " + items.size(), font(10, Font.NORMAL));
        meta.setSpacingAfter(12f);
        doc.add(meta);

        // Tabela
        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{18f, 12f, 12f, 12f, 14f, 14f, 18f});

        // Nagłówki
        addHeader(table, "Nazwa urządzenia");
        addHeader(table, "Model");
        addHeader(table, "Typ");
        addHeader(table, "Nr seryjny");
        addHeader(table, "Lokalizacja");
        addHeader(table, "Status");
        addHeader(table, "Nast. przegląd");

        // Wiersze
        for (Sprzet s : items) {
            addCell(table, nullSafe(s.getName()));
            addCell(table, nullSafe(s.getModel()));
            addCell(table, nullSafe(s.getType()));
            addCell(table, nullSafe(s.getSerialNumber()));
            addCell(table, nullSafe(s.getLocation()));
            addCell(table, s.getStatus() != null ? s.getStatus().name() : "-");
            String date = s.getNextInspectionDate() != null ? DF.format(s.getNextInspectionDate()) : "-";
            addCell(table, date);
        }

        doc.add(table);
        doc.close();
    }

    private void addHeader(PdfPTable t, String text) throws Exception {
        PdfPCell c = new PdfPCell(new Phrase(text, font(10, Font.BOLD)));
        c.setHorizontalAlignment(Element.ALIGN_CENTER);
        c.setVerticalAlignment(Element.ALIGN_MIDDLE);
        c.setBackgroundColor(new Color(240, 240, 240));
        c.setPadding(6f);
        t.addCell(c);
    }

    private void addCell(PdfPTable t, String text) throws Exception {
        PdfPCell c = new PdfPCell(new Phrase(text, font(10, Font.NORMAL)));
        c.setPadding(5f);
        t.addCell(c);
    }

    private String nullSafe(String s) {
        return (s == null || s.isBlank()) ? "-" : s;
    }
}

package pl.proz.sprzet.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import pl.proz.sprzet.dto.StatusUpdate;
import pl.proz.sprzet.model.Sprzet;
import pl.proz.sprzet.model.StatusSprzetu;
import pl.proz.sprzet.service.SprzetService;

import java.util.List;

@RestController
@RequestMapping("/api/sprzet")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class SprzetController {

    private final SprzetService service;

    @GetMapping
    public List<Sprzet> list(@RequestParam(required = false) StatusSprzetu status) {
        return service.list(status);
    }

    @PostMapping
    public Sprzet add(@RequestBody Sprzet s) {
        return service.add(s);
    }

    @PatchMapping("/{id}/status")
    public Sprzet updateStatus(@PathVariable Long id, @RequestBody StatusUpdate body) {
        return service.updateStatus(id, body.getStatus(), body.getNextInspectionDate());
    }
}

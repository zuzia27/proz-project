package pl.proz.sprzet.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pl.proz.sprzet.model.Sprzet;
import pl.proz.sprzet.model.StatusSprzetu;
import pl.proz.sprzet.repository.SprzetRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SprzetService {

    private final SprzetRepository repo;

    /** Reguła: SPRAWNY bez daty lub z datą ≤ dziś -> WYMAGA_PRZEGLADU */
    private void normalizeStatusByDate(Sprzet s) {
        if (s.getStatus() == StatusSprzetu.SPRAWNY) {
            LocalDate d = s.getNextInspectionDate();
            if (d == null || !d.isAfter(LocalDate.now())) {
                s.setStatus(StatusSprzetu.WYMAGA_PRZEGLADU);
            }
        }
    }

    /** Hurtowo oznacz przeterminowane jako WYMAGA_PRZEGLADU */
    @Transactional
    public int autoMarkOverdue() {
        return repo.markOverdueAsRequires(LocalDate.now());
    }

    @Transactional
    public List<Sprzet> list(StatusSprzetu status) {
        autoMarkOverdue(); // automatyczna aktualizacja przeterminowanych statusów (sprawdza datę przeglądu i jeśli jest przeterminowana, to zmienia status na WYMAGA_PRZEGLADU)
        if (status == null) return repo.findAll();
        return repo.findByStatus(status);
    }

    @Transactional
    public Sprzet add(Sprzet s) {
        normalizeStatusByDate(s);
        return repo.save(s);
    }

    @Transactional
    public Sprzet updateStatus(Long id, StatusSprzetu status, LocalDate nextInspectionDate) {
        Sprzet sprzet = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprzęt nie znaleziony: " + id));

        sprzet.setStatus(status);
        if (nextInspectionDate != null) {
            sprzet.setNextInspectionDate(nextInspectionDate);
        }

        normalizeStatusByDate(sprzet);
        return repo.save(sprzet);
    }
}

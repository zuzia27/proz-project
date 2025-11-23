package pl.proz.sprzet.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import pl.proz.sprzet.model.Sprzet;
import pl.proz.sprzet.model.StatusSprzetu;
import pl.proz.sprzet.repository.SprzetRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SprzetService {

    private final SprzetRepository repo;

    private void normalizeStatusByDate(Sprzet s) {
        if (s.getStatus() == StatusSprzetu.SPRAWNY) {
            LocalDate d = s.getNextInspectionDate();
            if (d == null || !d.isAfter(LocalDate.now())) {
                s.setStatus(StatusSprzetu.WYMAGA_PRZEGLADU);
            }
        }
    }

    @Transactional
    public int autoMarkOverdue() {
        return repo.markOverdueAsRequires(LocalDate.now());
    }

    @Transactional(readOnly = true)
    public List<Sprzet> list(StatusSprzetu status) {
        autoMarkOverdue();
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

    // ⬇⬇⬇ NOWA METODA z filtrami do PDF-a ⬇⬇⬇
    @Transactional(readOnly = true)
    public List<Sprzet> listFiltered(StatusSprzetu status,
                                     String location,
                                     String type,
                                     String sortBy,
                                     String sortDir) {

        autoMarkOverdue(); // dalej pilnujemy przeterminowanych

        String sortProperty = "name";
        if ("inspectionDate".equalsIgnoreCase(sortBy)) {
            sortProperty = "nextInspectionDate";
        }

        Sort.Direction dir =
                "desc".equalsIgnoreCase(sortDir)
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        Specification<Sprzet> spec = Specification.where(null);

        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        if (location != null && !location.isBlank()) {
            String loc = location.trim().toLowerCase();
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("location")), "%" + loc + "%"));
        }

        if (type != null && !type.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("type"), type));
        }

        return repo.findAll(spec, Sort.by(dir, sortProperty));
    }
}

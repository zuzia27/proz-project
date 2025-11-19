package pl.proz.sprzet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import pl.proz.sprzet.model.Sprzet;
import pl.proz.sprzet.model.StatusSprzetu;

import java.time.LocalDate;
import java.util.List;

public interface SprzetRepository extends JpaRepository<Sprzet, Long> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("""
        update Sprzet s
           set s.status = pl.proz.sprzet.model.StatusSprzetu.WYMAGA_PRZEGLADU
         where s.status = pl.proz.sprzet.model.StatusSprzetu.SPRAWNY
           and s.nextInspectionDate <= :today
    """)
    int markOverdueAsRequires(@Param("today") LocalDate today);

    List<Sprzet> findByStatus(StatusSprzetu status);
}

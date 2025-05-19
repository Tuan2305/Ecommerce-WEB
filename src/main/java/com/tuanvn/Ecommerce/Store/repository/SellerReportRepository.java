package com.tuanvn.Ecommerce.Store.repository;

import com.tuanvn.Ecommerce.Store.modal.SellerReport;
import com.tuanvn.Ecommerce.Store.service.SellerReportService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerReportRepository extends JpaRepository<SellerReport, Long> {
    SellerReport findBySellerId(Long sellerId);

}

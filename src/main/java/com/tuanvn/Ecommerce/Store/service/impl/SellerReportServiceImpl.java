package com.tuanvn.Ecommerce.Store.service.impl;

import com.tuanvn.Ecommerce.Store.modal.Seller;
import com.tuanvn.Ecommerce.Store.modal.SellerReport;
import com.tuanvn.Ecommerce.Store.repository.SellerReportRepository;
import com.tuanvn.Ecommerce.Store.service.SellerReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;


@Service
@RequiredArgsConstructor

public class SellerReportServiceImpl implements SellerReportService {

    private final SellerReportRepository reportRepository;
    private final SellerReportRepository sellerReportRepository;

    public SellerReportServiceImpl(SellerReportRepository reportRepository, SellerReportRepository sellerReportRepository) {
        this.reportRepository = reportRepository;
        this.sellerReportRepository = sellerReportRepository;
    }


    @Override
    public SellerReport getSellerReport(Seller seller) {
        SellerReport sr = sellerReportRepository.findBySellerId(seller.getId());

        if(sr == null){
            SellerReport newReport = new SellerReport();
            newReport.setSeller(seller);
            return sellerReportRepository.save(newReport);
        }

        return sr;
    }

    @Override
    public SellerReport updateSellerReport(SellerReport sellerReport) {
        return sellerReportRepository.save(sellerReport);
    }
}

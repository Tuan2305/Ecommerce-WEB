package com.tuanvn.Ecommerce.Store.service;

import com.tuanvn.Ecommerce.Store.modal.Seller;
import com.tuanvn.Ecommerce.Store.modal.SellerReport;

public interface SellerReportService {

    SellerReport getSellerReport(Seller seller);
    SellerReport updateSellerReport(SellerReport sellerReport);

}

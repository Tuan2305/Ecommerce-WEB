package com.tuanvn.Ecommerce.Store.controller;

import com.tuanvn.Ecommerce.Store.modal.Seller;
import com.tuanvn.Ecommerce.Store.modal.Transaction;
import com.tuanvn.Ecommerce.Store.service.SellerService;
import com.tuanvn.Ecommerce.Store.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;
    private final SellerService sellerService;

    public TransactionController(TransactionService transactionService, SellerService sellerService) {
        this.transactionService = transactionService;
        this.sellerService = sellerService;
    }

    @GetMapping("/seller")
    public ResponseEntity<List<Transaction>> getTransactionBySeller(
            @RequestHeader("Authorization") String jwt) throws Exception {
        Seller seller= sellerService.getSellerProfile(jwt);
        List<Transaction> transactions = transactionService.getTransactionsBySellerId(seller);
        return ResponseEntity.ok(transactions);

    }

    @GetMapping

    public ResponseEntity<List<Transaction>> getAllTransactions() {

        List<Transaction> transactions = transactionService.getAllTransactions();

        return ResponseEntity.ok(transactions);

    }

}



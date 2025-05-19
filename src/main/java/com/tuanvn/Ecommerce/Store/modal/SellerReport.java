package com.tuanvn.Ecommerce.Store.modal;

import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.*;

@Entity // anh xa 1 bang trong database
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class SellerReport {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne
    private Seller seller;

    private Long totalEarnings = 0L; // thong thu nhap

    private Long totalSales = 0L; // tong gia ban

    private Long totalRefunds = 0L; // tong tien hoan tra

    private Long totalTax = 0L; // tong tien thue

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Seller getSeller() {
        return seller;
    }

    public void setSeller(Seller seller) {
        this.seller = seller;
    }

    public Long getTotalEarnings() {
        return totalEarnings;
    }

    public void setTotalEarnings(Long totalEarnings) {
        this.totalEarnings = totalEarnings;
    }

    public Long getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(Long totalSales) {
        this.totalSales = totalSales;
    }

    public Long getTotalRefunds() {
        return totalRefunds;
    }

    public void setTotalRefunds(Long totalRefunds) {
        this.totalRefunds = totalRefunds;
    }

    public Long getNetEarnings() {
        return netEarnings;
    }

    public void setNetEarnings(Long netEarnings) {
        this.netEarnings = netEarnings;
    }

    public Integer getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Integer totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Long getTotalTax() {
        return totalTax;
    }

    public void setTotalTax(Long totalTax) {
        this.totalTax = totalTax;
    }

    public Integer getCanceledOrders() {
        return canceledOrders;
    }

    public void setCanceledOrders(Integer canceledOrders) {
        this.canceledOrders = canceledOrders;
    }

    public Integer getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(Integer totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    private Long netEarnings = 0L; // tong thu nhap thuc

    private Integer totalOrders = 0; // tong don hang

    private Integer canceledOrders = 0; // thong don tra ve

    private Integer totalTransactions = 0; // so don giao dich
}


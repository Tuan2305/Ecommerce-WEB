package com.tuanvn.Ecommerce.Store.request;

import lombok.Data;

@Data
public class AddressRequest {
    private String name;
    private String address;
    private String city;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setDefault(Boolean aDefault) {
        isDefault = aDefault;
    }

    private String mobile;
    private Boolean isDefault;

    public Boolean getIsDefault() {
        return isDefault;
    }
}
package com.shop.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.shop.common.Constant;
import com.shop.entitty.model.Category;
import com.shop.entitty.model.Product;
import com.shop.entitty.model.Voucher;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import static com.shop.utils.Common.formatDateComponents;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VoucherResponse {
    private Long voucherId;
    private String name;
    private int discountPercent;
    private Boolean status;
    private String description;
    private String startDate;
    private String endDate;
    private Category category;
    private Product product;

    public void setVoucherResponse(Voucher voucher){
        this.voucherId = voucher.getVoucherId();
        this.name = voucher.getName();
        this.discountPercent = voucher.getDiscountPercent();
        this.status = voucher.getStatus();
        this.description = voucher.getDescription();
        this.startDate = formatDateComponents(voucher.getStartDate());
        this.endDate = formatDateComponents(voucher.getEndDate());
        this.product = voucher.getProduct();
        this.category = voucher.getCategory();
    }
}

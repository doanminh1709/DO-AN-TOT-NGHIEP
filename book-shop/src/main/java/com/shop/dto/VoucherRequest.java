package com.shop.dto;

import com.shop.entitty.model.Category;
import com.shop.entitty.model.Product;
import com.shop.entitty.model.Voucher;
import com.shop.utils.Common;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VoucherRequest {
    private Long voucherId;
    private String name;
    private int discountPercent;
    private Boolean status;
    private String description;
    private String startDate;
    private String endDate;
    private Category category;
    private Product product;

    public static void setVoucher(Voucher voucher , VoucherRequest request){
        voucher.setName(request.getName());
        voucher.setDiscountPercent(request.getDiscountPercent());
        voucher.setDescription(request.getDescription());
        voucher.setStatus(true);


        voucher.setStartDate(Common.convertStringToDate(request.getStartDate()));
        voucher.setEndDate(Common.convertStringToDate(request.getEndDate()));
        voucher.setCategory(request.getCategory() == null ? null : request.getCategory());
        voucher.setProduct(request.getProduct() == null ? null : request.getProduct());
    }
}

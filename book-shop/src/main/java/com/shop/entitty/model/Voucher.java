package com.shop.entitty.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.shop.common.Constant;
import com.shop.entitty.base.AbstractAuditingEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@SuppressWarnings("serial")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Entity
@Table(name = "vouchers")
public class Voucher extends AbstractAuditingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long voucherId;
    private String name;
    private int discountPercent;
    private Boolean status;
    private String description;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = Constant.FORMAT_DATE_PATTERN, timezone = "UTC")
    private Date startDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = Constant.FORMAT_DATE_PATTERN, timezone = "UTC")
    private Date endDate;

    @OneToOne
    @JoinColumn(name = "categoryId")
    private Category category;

    @OneToOne
    @JoinColumn(name = "productId")
    private Product product;
}

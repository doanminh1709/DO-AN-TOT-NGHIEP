package com.shop.repository;

import com.shop.entitty.model.Category;
import com.shop.entitty.model.Product;
import com.shop.entitty.model.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher , Long> {

    boolean existsByName(String voucherName);
    boolean existsByCategory(Category category);
    boolean existsByProduct(Product product);
    @Query(value = "SELECT * FROM vouchers WHERE start_date < CURRENT_DATE", nativeQuery = true)
    List<Voucher> getAllVoucherExpired();

    @Query(value = "SELECT * FROM vouchers v where v.category_id = ?1", nativeQuery = true)
    Optional<Voucher> getVoucherByCategoryId(Long categoryId);


    @Query(value = "SELECT * FROM vouchers v where v.product_id = ?1", nativeQuery = true)
    Optional<Voucher> getVoucherByProductId(Long productId);

    @Query(value = "SELECT * FROM vouchers v where v.voucher_id = ?1" , nativeQuery = true)
    Optional<Voucher> getVoucherById(Long voucherId);
}

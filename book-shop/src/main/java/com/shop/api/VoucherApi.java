package com.shop.api;
import java.util.*;

import com.shop.dto.VoucherRequest;
import com.shop.dto.VoucherResponse;
import com.shop.entitty.model.Category;
import com.shop.entitty.model.Product;
import com.shop.entitty.model.Voucher;
import com.shop.repository.CategoryRepository;
import com.shop.repository.ProductRepository;
import com.shop.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.shop.dto.VoucherRequest.setVoucher;
import static com.shop.utils.Common.isStartDateAfterEndDate;

@CrossOrigin("*")
@RestController
@RequestMapping("api/vouchers")
public class VoucherApi {

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    private ResponseEntity<List<VoucherResponse>> findAllVoucher() {
        List<Voucher> voucherList = voucherRepository.findAll();
        List<VoucherResponse> responseList = new ArrayList<>();
        for (Voucher item : voucherList){
            if(item != null){
                VoucherResponse response = new VoucherResponse();
                response.setVoucherResponse(item);
                responseList.add(response);
            }
        }
        return ResponseEntity.ok(responseList);
    }

    @GetMapping("{id}")
    public ResponseEntity<VoucherResponse> getById(@PathVariable("id") Long id) {
        if (!voucherRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Voucher voucher = voucherRepository.getVoucherById(id).get();
        VoucherResponse response = new VoucherResponse();
        response.setVoucherResponse(voucher);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> post(@RequestBody VoucherRequest request) throws Exception {
        try {
            if (voucherRepository.existsByName(request.getName())) {
                return ResponseEntity.status(400).body("Mã khuyến mại đã tồn tại");
            }
            if (request.getCategory() == null && request.getProduct() == null) {
                return ResponseEntity.status(400).body("Một trong 2 danh mục hoặc sản phẩm không được để trống");
            }
            if (request.getCategory() != null) {
                Optional<Category> findCategory = categoryRepository.findById(request.getCategory().getCategoryId());
                if (findCategory.isPresent() && voucherRepository.existsByCategory(findCategory.get())) {
                    return ResponseEntity.status(400).body("Danh mục này đã được khuyến mại");
                }
            }
            if (request.getProduct() != null) {
                Optional<Product> findProduct = productRepository.findById(request.getProduct().getProductId());
                if (findProduct.isPresent() && voucherRepository.existsByProduct(findProduct.get())) {
                    return ResponseEntity.status(400).body("Sản phẩm này đã được khuyến mại");
                }
            }
            if (!isStartDateAfterEndDate(request.getStartDate(), request.getEndDate())) {
                return ResponseEntity.status(400).body("Ngày bắt đầu không thể nhỏ hơn ngày kết thúc");
            }

            Voucher newVoucher = new Voucher();
            setVoucher(newVoucher, request);
            voucherRepository.save(newVoucher);

            if (request.getCategory() != null) {
                List<Product> listProduct = productRepository.findByCategory(request.getCategory());
                listProduct.forEach(item -> {
                    item.setDiscount(request.getDiscountPercent());
                });
                productRepository.saveAll(listProduct);
            } else {
                Product product = productRepository.findById(request.getProduct().getProductId()).get();
                product.setDiscount(request.getDiscountPercent());
                productRepository.save(product);
            }
            return ResponseEntity.ok(newVoucher);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<?> put(@RequestBody VoucherRequest request, @PathVariable("id") Long id) {
        if (!id.equals(request.getVoucherId())) {
            return ResponseEntity.status(400).body("Mã khuyến mại không hợp lệ");
        }
        if (!voucherRepository.existsById(id)) {
            return ResponseEntity.status(400).body("Không tìm thấy khuyến mại theo mã định danh");
        }
        Voucher voucher = voucherRepository.findById(id).get();
        if (request.getCategory() != null) {
            Optional<Voucher> findByCategoryIdOptional = voucherRepository.getVoucherByCategoryId(request.getCategory().getCategoryId());
            if (findByCategoryIdOptional.isPresent() && !voucher.getVoucherId().equals(findByCategoryIdOptional.get().getVoucherId())) {
                return ResponseEntity.status(400).body("Danh mục này đã được khuyến mại");
            }
        }
        if (request.getProduct() != null) {
            Optional<Voucher> findByProductIdOptional = voucherRepository.getVoucherByProductId(request.getProduct().getProductId());
            if (findByProductIdOptional.isPresent() && !voucher.getVoucherId().equals(findByProductIdOptional.get().getVoucherId())) {
                return ResponseEntity.status(400).body("Sản phẩm này đã được khuyến mại");
            }
        }
        if (!isStartDateAfterEndDate(request.getStartDate(), request.getEndDate())) {
            return ResponseEntity.status(400).body("Ngày bắt đầu không thể nhỏ hơn ngày kết thúc");
        }
        setVoucher(voucher, request);
        voucherRepository.save(voucher);

        if (voucher.getCategory() != null) {
            List<Product> listProduct = productRepository.findByCategory(voucher.getCategory());
            listProduct.forEach(item -> {
                item.setDiscount(voucher.getDiscountPercent());
            });
            productRepository.saveAll(listProduct);
        } else {
            Product product = productRepository.findById(voucher.getProduct().getProductId()).get();
            product.setDiscount(voucher.getDiscountPercent());
            productRepository.save(product);
        }
        return ResponseEntity.ok(voucher);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!voucherRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        voucherRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

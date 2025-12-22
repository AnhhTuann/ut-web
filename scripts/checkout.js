let cart = JSON.parse(localStorage.getItem("kyVietCart")) || [];

// 1. Hiển thị danh sách sản phẩm khi tải trang
function renderCheckout() {
  const container = document.getElementById("checkout-items");
  const totalElement = document.getElementById("checkout-total");

  if (cart.length === 0) {
    container.innerHTML = "<p>Không có sản phẩm nào.</p>";
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => `
        <div class="summary__item">
            <span>${item.name} x ${item.quantity}</span>
            <span>${(item.price * item.quantity).toLocaleString()}đ</span>
        </div>
    `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalElement.innerText = total.toLocaleString();
}

// 2. Xử lý đặt hàng (Ví dụ: Gửi qua Zalo hoặc thông báo thành công)
window.placeOrder = function () {
  const name = document.getElementById("cus-name").value;
  const phone = document.getElementById("cus-phone").value;
  const address = document.getElementById("cus-address").value;
  const note = document.getElementById("cus-note").value || "Không có";

  if (!name || !phone || !address) {
    alert("Vui lòng điền đầy đủ thông tin giao hàng!");
    return;
  }

  // 1. Soạn nội dung thô với xuống dòng thực tế
  const productDetails = cart
    .map((item) => `- ${item.name} (x${item.quantity})`)
    .join("\n");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const rawMessage = `ĐƠN HÀNG MỚI TỪ WEBSITE
--------------------------
Khách hàng: ${name}
Số điện thoại: ${phone}
Địa chỉ: ${address}
Ghi chú: ${note}
--------------------------
Sản phẩm:
${productDetails}
--------------------------
TỔNG CỘNG: ${total.toLocaleString()} VND`;

  // 2. Sử dụng encodeURIComponent để mã hóa chuẩn URL
  const sdtChuShop = "0865002031";
  const zaloUrl = `https://zalo.me/${sdtChuShop}?text=${encodeURIComponent(
    rawMessage
  )}`;

  // 3. Thông báo cho khách hàng
  alert(
    "Hệ thống sẽ chuyển bạn sang Zalo. Hãy nhấn nút 'GỬI' trong ứng dụng Zalo để chủ shop nhận được đơn!"
  );

  window.open(zaloUrl, "_blank");

  // 4. Trì hoãn việc chuyển trang để đảm bảo lệnh mở Zalo được thực thi
  setTimeout(() => {
    localStorage.removeItem("kyVietCart");
    window.location.href = "index.html";
  }, 1000);
};

document.addEventListener("DOMContentLoaded", renderCheckout);

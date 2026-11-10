"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Barcode,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coins,
  CreditCard,
  DollarSign,
  FileText,
  Minus,
  Package,
  Plus,
  Printer,
  Receipt as ReceiptIcon,
  Search,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Tag,
  Trash2,
  TrendingUp,
  Truck,
  Users,
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useApp } from "@/contexts/AppContext";
import { useAppDispatch } from "@/store/hooks";
import { addTransaction } from "@/store/slices/transactionsSlice";
import { Modal } from "@/components/ui/Modal";

// ── Shared Retail Product Catalog ───────────────────────────────────────────
export interface RetailProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minThreshold: number;
  unit: string;
}

const INITIAL_RETAIL_PRODUCTS: RetailProduct[] = [
  { id: "p1", sku: "COF-SID-1KG", name: "Sidama Specialty Grade-1 Coffee (1kg)", category: "Beverages & Coffee", price: 650, cost: 420, stock: 8, minThreshold: 20, unit: "packs" },
  { id: "p2", sku: "TEFF-50KG", name: "Magna White Teff Grain (50kg Bag)", category: "Grains & Food", price: 6200, cost: 5100, stock: 4, minThreshold: 15, unit: "bags" },
  { id: "p3", sku: "OIL-5L", name: "Pure Sunflower Cooking Oil (5 Liters)", category: "Cooking Essentials", price: 850, cost: 680, stock: 12, minThreshold: 25, unit: "cans" },
  { id: "p4", sku: "SAM-A15", name: "Samsung Galaxy A15 (128GB LTE)", category: "Electronics", price: 12500, cost: 10400, stock: 35, minThreshold: 10, unit: "units" },
  { id: "p5", sku: "SUGAR-25KG", name: "Wonji Refined White Sugar (25kg Sack)", category: "Cooking Essentials", price: 2950, cost: 2400, stock: 0, minThreshold: 10, unit: "sacks" },
  { id: "p6", sku: "TEA-BLK-500", name: "Wushwush Black Highland Tea (500g)", category: "Beverages & Coffee", price: 220, cost: 140, stock: 64, minThreshold: 20, unit: "packs" },
  { id: "p7", sku: "SPICE-BER-1KG", name: "Traditional Ethiopian Berbere Blend (1kg)", category: "Cooking Essentials", price: 380, cost: 260, stock: 28, minThreshold: 15, unit: "packs" },
  { id: "p8", sku: "MILK-POW-1KG", name: "Full Cream Instant Powdered Milk (1kg)", category: "Grains & Food", price: 540, cost: 410, stock: 42, minThreshold: 15, unit: "tins" },
  { id: "p9", sku: "SOAP-BAR-PACK", name: "Antiseptic Hygiene Soap Bar (Pack of 4)", category: "Household Goods", price: 180, cost: 120, stock: 95, minThreshold: 30, unit: "packs" },
  { id: "p10", sku: "WATER-12X2L", name: "Arki Natural Spring Water (Case 12x2L)", category: "Beverages & Coffee", price: 320, cost: 220, stock: 50, minThreshold: 20, unit: "cases" },
];

const CATEGORIES = ["All Categories", "Beverages & Coffee", "Grains & Food", "Cooking Essentials", "Electronics", "Household Goods"];

// ── 1. POS CHECKOUT MODULE ───────────────────────────────────────────────────
export function POS() {
  const { openBarcodeModal, showToast, ethiopianDate } = useApp();
  const dispatch = useAppDispatch();

  const [products] = useState<RetailProduct[]>(INITIAL_RETAIL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [cart, setCart] = useState<{ product: RetailProduct; qty: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"Telebirr" | "Cash" | "CBE Birr">("Telebirr");
  const [mobileTab, setMobileTab] = useState<"catalog" | "cart">("catalog");
  const [receiptData, setReceiptData] = useState<{
    receiptNo: string;
    items: { product: RetailProduct; qty: number }[];
    subtotal: number;
    vat: number;
    total: number;
    method: string;
    date: string;
  } | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: RetailProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    showToast(`Added ${product.name} to cart`);
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: RetailProduct; qty: number }[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const vat = Math.round(subtotal * 0.15); // Ethiopian VAT 15%
  const grandTotal = subtotal + vat;
  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      showToast("Cart is empty. Add products to checkout.");
      return;
    }

    const receiptNo = `REC-${Date.now().toString(36).toUpperCase()}`;

    // Record into ERP Transactions
    dispatch(
      addTransaction({
        type: "INCOME",
        amount: grandTotal,
        description: `POS Sale: ${totalItemsCount} items (${cart.map((c) => c.product.name).slice(0, 2).join(", ")}${cart.length > 2 ? "..." : ""})`,
        category: "Sales",
        paymentMethod,
        vatAmount: vat,
        status: "COMPLETED",
        occurredAt: new Date().toISOString(),
      })
    );

    setReceiptData({
      receiptNo,
      items: [...cart],
      subtotal,
      vat,
      total: grandTotal,
      method: paymentMethod,
      date: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    });

    clearCart();
    setMobileTab("catalog");
    showToast(`Sale recorded successfully! Total: ETB ${grandTotal.toLocaleString()}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            POS Register & Checkout
          </h2>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>
            Fast sales terminal, VAT 15% receipting, and instant payment recording.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={openBarcodeModal}
            className="secondary-button"
            style={{ height: 32, padding: "0 12px", fontSize: 13, fontWeight: 500, borderRadius: 6 }}
          >
            <Barcode size={14} /> Scan Barcode
          </button>
        </div>
      </div>

      {/* Mobile Tab Toggle */}
      <div className="pos-mobile-toggle" style={{ display: "none", gap: 8 }}>
        <button
          type="button"
          onClick={() => setMobileTab("catalog")}
          style={{
            flex: 1,
            height: 36,
            borderRadius: 6,
            border: "1px solid var(--border-line)",
            background: mobileTab === "catalog" ? "var(--accent-blue)" : "var(--bg-surface)",
            color: mobileTab === "catalog" ? "#ffffff" : "var(--text-primary)",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Product Catalog ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("cart")}
          style={{
            flex: 1,
            height: 36,
            borderRadius: 6,
            border: "1px solid var(--border-line)",
            background: mobileTab === "cart" ? "var(--accent-blue)" : "var(--bg-surface)",
            color: mobileTab === "cart" ? "#ffffff" : "var(--text-primary)",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            position: "relative",
          }}
        >
          Cart ({totalItemsCount})
          {totalItemsCount > 0 && (
            <span
              style={{
                marginLeft: 6,
                padding: "2px 6px",
                borderRadius: 10,
                background: mobileTab === "cart" ? "#ffffff" : "var(--accent-blue)",
                color: mobileTab === "cart" ? "var(--accent-blue)" : "#ffffff",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              ETB {grandTotal.toLocaleString()}
            </span>
          )}
        </button>
      </div>

      {/* POS Grid: Catalog on left, Cart on right */}
      <div className="pos-layout-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Catalog Section */}
        <div className={`pos-catalog-panel ${mobileTab === "cart" ? "hide-on-mobile" : ""}`} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Search & Category Pills */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search products by title or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  height: 38,
                  padding: "0 12px 0 36px",
                  borderRadius: 6,
                  border: "1px solid var(--border-line)",
                  background: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    height: 28,
                    padding: "0 10px",
                    borderRadius: 14,
                    border: "1px solid var(--border-line)",
                    background: selectedCategory === cat ? "var(--accent-blue)" : "var(--bg-surface)",
                    color: selectedCategory === cat ? "#ffffff" : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {filteredProducts.map((p) => {
              const isOut = p.stock <= 0;
              return (
                <div
                  key={p.id}
                  style={{
                    padding: 14,
                    borderRadius: 8,
                    border: "1px solid var(--border-line)",
                    background: "var(--bg-surface)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 10,
                    opacity: isOut ? 0.6 : 1,
                    transition: "border-color 0.15s ease",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{p.sku}</span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: isOut ? "rgba(239, 68, 68, 0.12)" : p.stock <= p.minThreshold ? "rgba(245, 158, 11, 0.12)" : "var(--bg-subtle)",
                          color: isOut ? "var(--negative, #ef4444)" : p.stock <= p.minThreshold ? "var(--warning, #f59e0b)" : "var(--text-muted)",
                        }}
                      >
                        {isOut ? "Out of Stock" : `${p.stock} in stock`}
                      </span>
                    </div>

                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginTop: 6, lineHeight: 1.3 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{p.category}</div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--border-line)" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                      ETB {p.price.toLocaleString()}
                    </div>

                    <button
                      type="button"
                      disabled={isOut}
                      onClick={() => addToCart(p)}
                      style={{
                        height: 30,
                        padding: "0 10px",
                        borderRadius: 6,
                        border: "1px solid var(--accent-blue)",
                        background: "var(--accent-blue)",
                        color: "#ffffff",
                        fontSize: 12,
                        fontWeight: 500,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        cursor: isOut ? "not-allowed" : "pointer",
                      }}
                    >
                      <Plus size={13} /> Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cart / Checkout Section */}
        <div className={`pos-cart-panel ${mobileTab === "catalog" ? "hide-on-mobile" : ""}`} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            className="ui-surface"
            style={{
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              position: "sticky",
              top: 76,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 10, borderBottom: "1px solid var(--border-line)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ShoppingCart size={16} style={{ color: "var(--accent-blue)" }} />
                <strong style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Current Sale</strong>
                <span className="chip">{totalItemsCount}</span>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  style={{ border: "none", background: "transparent", color: "var(--negative, #ef4444)", fontSize: 12, cursor: "pointer", fontWeight: 500 }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 280, overflowY: "auto" }}>
              {cart.length === 0 ? (
                <div style={{ padding: "30px 10px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                  No items in cart.<br />Select products from the catalog.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                      padding: "8px 0",
                      borderBottom: "1px dashed var(--border-line)",
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.product.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        ETB {item.product.price} each
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => updateQty(item.product.id, -1)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          border: "1px solid var(--border-line)",
                          background: "var(--bg-subtle)",
                          color: "var(--text-primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Minus size={11} />
                      </button>

                      <span style={{ fontSize: 12, fontWeight: 600, minWidth: 16, textAlign: "center" }}>
                        {item.qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQty(item.product.id, 1)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          border: "1px solid var(--border-line)",
                          background: "var(--bg-subtle)",
                          color: "var(--text-primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Plus size={11} />
                      </button>

                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", minWidth: 60, textAlign: "right" }}>
                        ETB {(item.product.price * item.qty).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Price Calculations */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 10, borderTop: "1px solid var(--border-line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)" }}>
                <span>Subtotal</span>
                <span>ETB {subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)" }}>
                <span>VAT (15% ERCA)</span>
                <span>ETB {vat.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", paddingTop: 6, borderTop: "1px solid var(--border-line)" }}>
                <span>Grand Total</span>
                <span style={{ color: "var(--accent-blue)" }}>ETB {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Payment Method
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                {(["Telebirr", "Cash", "CBE Birr"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    style={{
                      height: 32,
                      borderRadius: 6,
                      border: paymentMethod === m ? "1px solid var(--accent-blue)" : "1px solid var(--border-line)",
                      background: paymentMethod === m ? "var(--accent-blue-subtle)" : "transparent",
                      color: paymentMethod === m ? "var(--accent-blue)" : "var(--text-secondary)",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                    }}
                  >
                    {m === "Telebirr" && "📱"}
                    {m === "Cash" && "💵"}
                    {m === "CBE Birr" && "🏦"}
                    <span>{m}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Complete Sale Button */}
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleCompleteSale}
              style={{
                height: 40,
                borderRadius: 6,
                border: "none",
                background: cart.length === 0 ? "var(--border-strong)" : "var(--accent-blue)",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                cursor: cart.length === 0 ? "not-allowed" : "pointer",
                boxShadow: cart.length > 0 ? "0 2px 6px rgba(37, 99, 235, 0.2)" : "none",
              }}
            >
              <CheckCircle2 size={16} /> Pay & Complete Sale
            </button>
          </div>
        </div>
      </div>

      {/* Sale Receipt Modal */}
      {receiptData && (
        <Modal title="Receipt Completed" isOpen={!!receiptData} onClose={() => setReceiptData(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                padding: 16,
                background: "var(--bg-subtle)",
                borderRadius: 8,
                border: "1px dashed var(--border-strong)",
                fontFamily: "monospace",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontSize: 12,
              }}
            >
              <div style={{ textAlign: "center", paddingBottom: 8, borderBottom: "1px solid var(--border-line)" }}>
                <strong style={{ fontSize: 14 }}>BEYOND ERP RETAIL</strong>
                <div>VAT Registered: 0012345678</div>
                <div>{ethiopianDate} · {receiptData.date}</div>
                <div>Receipt: {receiptData.receiptNo}</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "8px 0" }}>
                {receiptData.items.map((it) => (
                  <div key={it.product.id} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{it.qty}x {it.product.name}</span>
                    <span>ETB {(it.qty * it.product.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid var(--border-line)", paddingTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal:</span>
                  <span>ETB {receiptData.subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>VAT (15%):</span>
                  <span>ETB {receiptData.vat.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 13, paddingTop: 4 }}>
                  <span>TOTAL PAID ({receiptData.method}):</span>
                  <span>ETB {receiptData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="secondary-button"
                style={{ height: 32, padding: "0 14px", borderRadius: 6 }}
              >
                <Printer size={14} /> Print
              </button>
              <button
                type="button"
                onClick={() => setReceiptData(null)}
                className="primary-button"
                style={{ height: 32, padding: "0 16px", borderRadius: 6 }}
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── 2. INVENTORY MODULE ──────────────────────────────────────────────────────
export function Inventory() {
  const { openBarcodeModal, showToast } = useApp();
  const [products, setProducts] = useState<RetailProduct[]>(INITIAL_RETAIL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "LOW_STOCK" | "IN_STOCK" | "OUT_OF_STOCK">("ALL");
  const [adjustingProduct, setAdjustingProduct] = useState<RetailProduct | null>(null);
  const [addQty, setAddQty] = useState(25);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    sku: "",
    name: "",
    category: "Grains & Food",
    price: 100,
    cost: 70,
    stock: 20,
    minThreshold: 10,
    unit: "pcs",
  });

  const totalSKUs = products.length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.minThreshold).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + p.cost * p.stock, 0);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "LOW_STOCK") return p.stock > 0 && p.stock <= p.minThreshold;
    if (filter === "OUT_OF_STOCK") return p.stock === 0;
    if (filter === "IN_STOCK") return p.stock > p.minThreshold;
    return true;
  });

  const handleApplyAdjustment = () => {
    if (!adjustingProduct) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === adjustingProduct.id ? { ...p, stock: p.stock + addQty } : p))
    );
    showToast(`Updated stock: +${addQty} ${adjustingProduct.unit} for ${adjustingProduct.name}`);
    setAdjustingProduct(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.sku) {
      showToast("Please fill in SKU and Product Name");
      return;
    }
    const created: RetailProduct = {
      id: `p-${Date.now()}`,
      ...newProduct,
    };
    setProducts((prev) => [created, ...prev]);
    setShowAddModal(false);
    showToast(`Added ${created.name} to inventory!`);
    setNewProduct({
      sku: "",
      name: "",
      category: "Grains & Food",
      price: 100,
      cost: 70,
      stock: 20,
      minThreshold: 10,
      unit: "pcs",
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Inventory Management
          </h2>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>
            Track live stock levels, unit costs, reorder alerts, and warehouse counts.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={openBarcodeModal}
            className="secondary-button"
            style={{ height: 32, padding: "0 12px", fontSize: 13, fontWeight: 500, borderRadius: 6 }}
          >
            <Barcode size={14} /> Scan / Barcode
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="primary-button"
            style={{ height: 32, padding: "0 14px", fontSize: 13, fontWeight: 500, borderRadius: 6 }}
          >
            <Plus size={14} /> Add Stock Item
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="kpi-strip" style={{ marginBottom: 0 }}>
        <div className="kpi-cell">
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Total SKUs
          </span>
          <div style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)" }}>{totalSKUs}</div>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Active product lines</span>
        </div>
        <div className="kpi-cell">
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Low Stock Alerts
          </span>
          <div style={{ fontSize: 20, fontWeight: 600, color: "var(--warning, #f59e0b)" }}>{lowStockCount}</div>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Below threshold</span>
        </div>
        <div className="kpi-cell">
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Out of Stock
          </span>
          <div style={{ fontSize: 20, fontWeight: 600, color: "var(--negative, #ef4444)" }}>{outOfStockCount}</div>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Immediate reorder</span>
        </div>
        <div className="kpi-cell">
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Inventory Valuation
          </span>
          <div style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)" }}>
            ETB {totalValue.toLocaleString()}
          </div>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>At landed unit cost</span>
        </div>
      </div>

      {/* Search & Filter Tabs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ position: "relative", minWidth: 240, flex: "1 1 240px" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search inventory by title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              height: 36,
              padding: "0 12px 0 34px",
              borderRadius: 6,
              border: "1px solid var(--border-line)",
              background: "var(--bg-surface)",
              color: "var(--text-primary)",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            { id: "ALL", label: `All (${products.length})` },
            { id: "LOW_STOCK", label: `Low Stock (${lowStockCount})` },
            { id: "OUT_OF_STOCK", label: `Out of Stock (${outOfStockCount})` },
            { id: "IN_STOCK", label: "Healthy Stock" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as typeof filter)}
              style={{
                height: 32,
                padding: "0 12px",
                borderRadius: 6,
                border: "1px solid var(--border-line)",
                background: filter === tab.id ? "var(--accent-blue)" : "var(--bg-surface)",
                color: filter === tab.id ? "#ffffff" : "var(--text-secondary)",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Items Table / Surface */}
      <div className="ui-surface" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-line)", background: "var(--bg-subtle)", color: "var(--text-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                <th style={{ padding: "10px 16px" }}>SKU</th>
                <th style={{ padding: "10px 16px" }}>Product Name</th>
                <th style={{ padding: "10px 16px" }}>Category</th>
                <th style={{ padding: "10px 16px" }}>Current Stock</th>
                <th style={{ padding: "10px 16px" }}>Unit Cost</th>
                <th style={{ padding: "10px 16px" }}>Selling Price</th>
                <th style={{ padding: "10px 16px" }}>Status</th>
                <th style={{ padding: "10px 16px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => {
                const isOut = item.stock <= 0;
                const isLow = item.stock > 0 && item.stock <= item.minThreshold;
                const isLast = idx === filtered.length - 1;

                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: isLast ? "none" : "1px solid var(--border-line)",
                      transition: "background 0.12s ease",
                    }}
                  >
                    <td style={{ padding: "12px 16px", fontFamily: "monospace", color: "var(--text-secondary)", fontWeight: 500 }}>
                      {item.sku}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {item.name}
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>
                      {item.category}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                      <span style={{ color: isOut ? "var(--negative, #ef4444)" : isLow ? "var(--warning, #f59e0b)" : "var(--text-primary)" }}>
                        {item.stock} {item.unit}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 4 }}>
                        (min {item.minThreshold})
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>
                      ETB {item.cost.toLocaleString()}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--text-primary)" }}>
                      ETB {item.price.toLocaleString()}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: 4,
                          textTransform: "uppercase",
                          letterSpacing: "0.03em",
                          background: isOut
                            ? "rgba(239, 68, 68, 0.15)"
                            : isLow
                            ? "rgba(245, 158, 11, 0.15)"
                            : "rgba(16, 185, 129, 0.12)",
                          color: isOut
                            ? "var(--negative, #ef4444)"
                            : isLow
                            ? "var(--warning, #f59e0b)"
                            : "var(--positive, #10b981)",
                        }}
                      >
                        {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => {
                            setAdjustingProduct(item);
                            setAddQty(25);
                          }}
                          style={{
                            height: 28,
                            padding: "0 8px",
                            borderRadius: 4,
                            border: "1px solid var(--border-line)",
                            background: "var(--bg-subtle)",
                            color: "var(--text-primary)",
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Plus size={11} /> Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Adjustment Modal */}
      {adjustingProduct && (
        <Modal
          title={`Restock: ${adjustingProduct.name}`}
          isOpen={!!adjustingProduct}
          onClose={() => setAdjustingProduct(null)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Current stock: <strong>{adjustingProduct.stock} {adjustingProduct.unit}</strong>. Select or enter restock quantity:
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {[10, 25, 50, 100].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAddQty(preset)}
                  style={{
                    flex: 1,
                    height: 34,
                    borderRadius: 6,
                    border: addQty === preset ? "1px solid var(--accent-blue)" : "1px solid var(--border-line)",
                    background: addQty === preset ? "var(--accent-blue-subtle)" : "transparent",
                    color: addQty === preset ? "var(--accent-blue)" : "var(--text-primary)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  +{preset}
                </button>
              ))}
            </div>

            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>
              Custom Amount ({adjustingProduct.unit})
              <input
                type="number"
                min={1}
                value={addQty}
                onChange={(e) => setAddQty(Number(e.target.value))}
                style={{
                  height: 36,
                  padding: "0 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border-line)",
                  background: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </label>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setAdjustingProduct(null)}
                className="secondary-button"
                style={{ height: 32, padding: "0 14px", borderRadius: 6 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyAdjustment}
                className="primary-button"
                style={{ height: 32, padding: "0 16px", borderRadius: 6 }}
              >
                Confirm Restock
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add New Stock Item Modal */}
      {showAddModal && (
        <Modal title="Add New Inventory Stock" isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleCreateProduct} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>
                SKU / Barcode Code
                <input
                  required
                  placeholder="e.g. BEV-001"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value.toUpperCase() })}
                  style={{ height: 36, padding: "0 10px", borderRadius: 6, border: "1px solid var(--border-line)", background: "var(--bg-surface)", color: "var(--text-primary)" }}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>
                Category
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  style={{ height: 36, padding: "0 10px", borderRadius: 6, border: "1px solid var(--border-line)", background: "var(--bg-surface)", color: "var(--text-primary)" }}
                >
                  {CATEGORIES.filter((c) => c !== "All Categories").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>

            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>
              Product Title
              <input
                required
                placeholder="e.g. Premium White Coffee (500g)"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                style={{ height: 36, padding: "0 10px", borderRadius: 6, border: "1px solid var(--border-line)", background: "var(--bg-surface)", color: "var(--text-primary)" }}
              />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>
                Landed Unit Cost (ETB)
                <input
                  type="number"
                  min={0}
                  value={newProduct.cost}
                  onChange={(e) => setNewProduct({ ...newProduct, cost: Number(e.target.value) })}
                  style={{ height: 36, padding: "0 10px", borderRadius: 6, border: "1px solid var(--border-line)", background: "var(--bg-surface)", color: "var(--text-primary)" }}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>
                Retail Selling Price (ETB)
                <input
                  type="number"
                  min={0}
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  style={{ height: 36, padding: "0 10px", borderRadius: 6, border: "1px solid var(--border-line)", background: "var(--bg-surface)", color: "var(--text-primary)" }}
                />
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>
                Initial Stock Qty
                <input
                  type="number"
                  min={0}
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                  style={{ height: 36, padding: "0 10px", borderRadius: 6, border: "1px solid var(--border-line)", background: "var(--bg-surface)", color: "var(--text-primary)" }}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>
                Safety Threshold
                <input
                  type="number"
                  min={1}
                  value={newProduct.minThreshold}
                  onChange={(e) => setNewProduct({ ...newProduct, minThreshold: Number(e.target.value) })}
                  style={{ height: 36, padding: "0 10px", borderRadius: 6, border: "1px solid var(--border-line)", background: "var(--bg-surface)", color: "var(--text-primary)" }}
                />
              </label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="secondary-button"
                style={{ height: 32, padding: "0 14px", borderRadius: 6 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-button"
                style={{ height: 32, padding: "0 16px", borderRadius: 6 }}
              >
                Save Item
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── 3. PRODUCTS MODULE ───────────────────────────────────────────────────────
export function Products() {
  const { openBarcodeModal, showToast } = useApp();
  const [products, setProducts] = useState<RetailProduct[]>(INITIAL_RETAIL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === "All Categories" || p.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Product Catalog & Pricing
          </h2>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>
            Manage pricing tiers, barcodes, categories, and inventory SKU definitions.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={openBarcodeModal}
            className="secondary-button"
            style={{ height: 32, padding: "0 12px", fontSize: 13, fontWeight: 500, borderRadius: 6 }}
          >
            <Barcode size={14} /> Barcode Generator
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ position: "relative", minWidth: 240, flex: "1 1 240px" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search product catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              height: 36,
              padding: "0 12px 0 34px",
              borderRadius: 6,
              border: "1px solid var(--border-line)",
              background: "var(--bg-surface)",
              color: "var(--text-primary)",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              style={{
                height: 32,
                padding: "0 12px",
                borderRadius: 6,
                border: "1px solid var(--border-line)",
                background: category === c ? "var(--accent-blue)" : "var(--bg-surface)",
                color: category === c ? "#ffffff" : "var(--text-secondary)",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            className="ui-surface"
            style={{
              padding: 16,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text-muted)" }}>{item.sku}</span>
                <span className="chip" style={{ fontSize: 11 }}>{item.category}</span>
              </div>

              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginTop: 8 }}>
                {item.name}
              </div>
            </div>

            <div style={{ paddingTop: 10, borderTop: "1px solid var(--border-line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Retail Price</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                  ETB {item.price.toLocaleString()}
                </div>
              </div>

              <button
                type="button"
                onClick={openBarcodeModal}
                className="secondary-button"
                style={{ height: 28, padding: "0 8px", fontSize: 11, borderRadius: 4 }}
                title="View Barcode"
              >
                <Barcode size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 4. CUSTOMERS MODULE ──────────────────────────────────────────────────────
export function Customers() {
  const { showToast } = useApp();
  const [customers, setCustomers] = useState([
    { id: "c1", name: "Abebe Bekele", phone: "+251 91 123 4567", creditLimit: 50000, balance: 12500, totalOrders: 28 },
    { id: "c2", name: "Tigist Haile", phone: "+251 92 234 5678", creditLimit: 30000, balance: 0, totalOrders: 14 },
    { id: "c3", name: "Biruk Desta Wholesale", phone: "+251 93 345 6789", creditLimit: 120000, balance: 45000, totalOrders: 62 },
    { id: "c4", name: "Hiwot Mengistu Supermarket", phone: "+251 94 456 7890", creditLimit: 80000, balance: 18200, totalOrders: 35 },
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "var(--text-primary)" }}>Customer Accounts & Credit Ledger</h2>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>Manage wholesale credit accounts, terms, and purchase histories.</p>
        </div>
        <button
          type="button"
          onClick={() => showToast("Add customer form opened")}
          className="primary-button"
          style={{ height: 32, padding: "0 14px", borderRadius: 6 }}
        >
          <Plus size={14} /> Add Customer
        </button>
      </div>

      <div className="ui-surface" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border-line)", color: "var(--text-muted)", fontSize: 11, textTransform: "uppercase" }}>
              <th style={{ padding: "10px 16px", textAlign: "left" }}>Customer</th>
              <th style={{ padding: "10px 16px", textAlign: "left" }}>Phone</th>
              <th style={{ padding: "10px 16px", textAlign: "left" }}>Total Orders</th>
              <th style={{ padding: "10px 16px", textAlign: "left" }}>Credit Limit</th>
              <th style={{ padding: "10px 16px", textAlign: "right" }}>Outstanding Balance</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: i === customers.length - 1 ? "none" : "1px solid var(--border-line)" }}>
                <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--text-primary)" }}>{c.name}</td>
                <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{c.phone}</td>
                <td style={{ padding: "12px 16px" }}>{c.totalOrders} sales</td>
                <td style={{ padding: "12px 16px" }}>ETB {c.creditLimit.toLocaleString()}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: c.balance > 0 ? "var(--negative, #ef4444)" : "var(--positive, #10b981)" }}>
                  ETB {c.balance.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── 5. SUPPLIERS MODULE ──────────────────────────────────────────────────────
export function Suppliers() {
  const { showToast } = useApp();
  const [suppliers] = useState([
    { id: "s1", name: "Wonji Sugar Factory Corp", category: "Sugar & Food", contact: "+251 11 551 2233", openOrders: 2, payables: 84000 },
    { id: "s2", name: "East Africa Bottling SC (Coca-Cola)", category: "Beverages", contact: "+251 11 662 1100", openOrders: 1, payables: 42000 },
    { id: "s3", name: "Modjo Oil Millers Cooperative", category: "Cooking Oil", contact: "+251 22 111 8899", openOrders: 3, payables: 125000 },
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "var(--text-primary)" }}>Supplier Procurement & Payables</h2>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>Purchase orders, factory deliveries, and vendor payables tracking.</p>
        </div>
        <button
          type="button"
          onClick={() => showToast("Add supplier form opened")}
          className="primary-button"
          style={{ height: 32, padding: "0 14px", borderRadius: 6 }}
        >
          <Plus size={14} /> Add Supplier
        </button>
      </div>

      <div className="ui-surface" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border-line)", color: "var(--text-muted)", fontSize: 11, textTransform: "uppercase" }}>
              <th style={{ padding: "10px 16px", textAlign: "left" }}>Supplier</th>
              <th style={{ padding: "10px 16px", textAlign: "left" }}>Category</th>
              <th style={{ padding: "10px 16px", textAlign: "left" }}>Contact</th>
              <th style={{ padding: "10px 16px", textAlign: "left" }}>Open Orders</th>
              <th style={{ padding: "10px 16px", textAlign: "right" }}>Pending Payables</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i === suppliers.length - 1 ? "none" : "1px solid var(--border-line)" }}>
                <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--text-primary)" }}>{s.name}</td>
                <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{s.category}</td>
                <td style={{ padding: "12px 16px" }}>{s.contact}</td>
                <td style={{ padding: "12px 16px" }}>{s.openOrders} POs</td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "var(--text-primary)" }}>
                  ETB {s.payables.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── 6. SALES REPORTS MODULE ──────────────────────────────────────────────────
export function SalesReports() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "var(--text-primary)" }}>Daily Sales & VAT Ledger</h2>
        <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>ERCA 15% VAT breakdown, daily cashier totals, and product velocities.</p>
      </div>

      <div className="kpi-strip" style={{ marginBottom: 0 }}>
        <div className="kpi-cell">
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase" }}>Today's Revenue</span>
          <div style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)" }}>ETB 48,250</div>
          <span style={{ fontSize: 12, color: "var(--positive, #10b981)" }}>+14% vs yesterday</span>
        </div>
        <div className="kpi-cell">
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase" }}>VAT Collected (15%)</span>
          <div style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)" }}>ETB 7,237</div>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>ERCA Declaration Ready</span>
        </div>
        <div className="kpi-cell">
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase" }}>Cash Drawer</span>
          <div style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)" }}>ETB 18,400</div>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Balanced at shift</span>
        </div>
        <div className="kpi-cell">
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase" }}>Telebirr Digital</span>
          <div style={{ fontSize: 20, fontWeight: 600, color: "var(--accent-blue)" }}>ETB 29,850</div>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>62% of all volume</span>
        </div>
      </div>
    </div>
  );
}

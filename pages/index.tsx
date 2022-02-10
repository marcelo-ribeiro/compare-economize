import Head from "next/head";
import { FormEvent, useMemo, useRef, useState } from "react";

const generateId = new (function () {
  let id = 1;
  this.get = () => id++;
  this.reset = () => (id = 0);
})();

type TDefaultItem = {
  id: number;
  name: string;
  price: number | string;
  amount: number | string;
  quantity: number | string;
  unitPrice?: number;
  difference?: number;
};

const getDefaultItem = (): TDefaultItem => ({
  id: generateId.get(),
  name: "",
  price: "",
  amount: "",
  quantity: 1,
  unitPrice: 0,
  difference: 0,
});

const formatPrice = (price: number | string, options?: any) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "BRL",
    ...options,
  }).format(parseFloat(price.toString()));

const Index = () => {
  const [items, setItems] = useState<TDefaultItem[]>([]);
  const [resultItems, setResultItems] = useState<any[]>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [formData, setFormData] = useState<TDefaultItem>();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const addItem = () => {
    setModalShow(true);
    const data = getDefaultItem();
    setFormData(data);
  };

  const removeItem = (event, index: number) => {
    event.stopPropagation();
    setItems((prev) => prev.filter((item, i) => i !== index));
  };

  const changeItem = (event) => {
    const { name, value, valueAsNumber, type } = event.target;
    const newValue = type === "number" ? valueAsNumber || "" : value;
    setFormData((item) => ({ ...item, [name]: newValue }));
  };

  const editItem = (formData: TDefaultItem) => {
    setFormData({ ...formData });
    setModalShow(true);
    setIsEdit(true);
  };

  const submitItem = (event: FormEvent) => {
    event.preventDefault();
    const map: TDefaultItem[] = calculate({ ...formData });
    setItems(map);
    setModalShow(false);
    setIsEdit(false);
  };

  const calculate = (formData: TDefaultItem): TDefaultItem[] => {
    const getUnitPrice = (item: any) =>
      item.price / (item.amount * item.quantity);

    formData.name = formData.name || `Produto ${formData.id}`;
    formData.unitPrice = getUnitPrice(formData);

    const _items: TDefaultItem[] = (() => {
      if (isEdit) {
        return items.map((item) => (item.id === formData.id ? formData : item));
      } else {
        return items?.length ? [...items, formData] : [formData];
      }
    })();

    if (_items.length > 1) {
      _items
        .sort((a, b) => a.unitPrice - b.unitPrice)
        .forEach((item, index, array) => {
          item.difference = getPriceDifference(item, array);
        });
    }

    return _items;
  };

  const getPriceDifference = (item: any, array: any) => {
    const highestItem = [...array].pop();
    // const comparedPrice =
    //   item.unitPrice * highestItem.amount * highestItem.quantity;
    const comparedPrice = highestItem.unitPrice * item.amount * item.quantity;
    // const difference = highestItem.price - comparedPrice;
    const difference = comparedPrice - item.price;
    return difference || 0;
  };

  const reset = () => {
    generateId.reset();
    setItems([]);
    setIsReady(false);
  };

  const hasNoDiferrence = useMemo(() => {
    return items?.every((item) => item.difference === 0);
  }, [items]);

  const isLowestPrice = (item: TDefaultItem) => {
    if (items?.length < 2 || !item) return false;
    return item.id === items[0].id;
  };

  const isHighestPrice = (item: TDefaultItem) => {
    if (items?.length < 2 || !item) return false;
    return item.id === items[items.length - 1].id;
  };

  return (
    <main>
      <Head>
        <title>Compare preços</title>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <header className="app-header">
        <h1>
          Compare
          <span style={{ color: "var(--color-success)" }}>Economize</span>
        </h1>

        {!!items.length && (
          <nav style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={reset}
              className="button button--icon button--clear button--small"
            >
              {/* Limpar */}
              <svg
                className="icon icon-delete"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </button>
          </nav>
        )}

        {/* <nav
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          <button
            className="button button--icon button--clear"
            onClick={addItem}
          >
            +
          </button>
        </nav> */}
      </header>

      <section
        className="container"
        style={{ display: "grid", gap: "0.5rem", textAlign: "center" }}
      >
        {items?.length >= 2 ? (
          hasNoDiferrence ? (
            <h3 className="color--danger">
              Não há diferença de preço entre os produtos.
            </h3>
          ) : (
            <>
              <h3>{items[0].name} é o produto mais barato.</h3>
              <h3 className="color--success">
                {`Você economizou ${formatPrice(items[0].difference)}`}
              </h3>
            </>
          )
        ) : !items.length ? (
          <>
            <h3>Não há produtos para comparar.</h3>
            <div
              style={{
                color: "var(--color-medium)",
                fontSize: ".75rem",
              }}
            >
              Clique no botão abaixo para adicionar um ou mais produtos.
            </div>
          </>
        ) : items.length <= 1 ? (
          <h3>Adicione um ou mais produtos para comparar</h3>
        ) : (
          ""
        )}
      </section>

      <section style={{ display: "grid", gap: "1rem" }}>
        {items?.length >= 2 && !hasNoDiferrence && (
          <p
            className="container color--medium"
            style={{ fontSize: "0.75rem" }}
          >
            Ordenado pelo mais barato:
          </p>
        )}

        <div className="cards container">
          {items?.map((item, index) => (
            <div
              className={`
                card 
                ${!hasNoDiferrence && isLowestPrice(item) ? "active" : ""}
                ${!hasNoDiferrence && isHighestPrice(item) ? "danger" : ""}
              `}
              style={{ fontSize: "0.75rem" }}
              key={index}
              onClick={() => editItem(item)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong style={{ fontSize: "1rem" }}>{item.name}</strong>

                <button
                  type="button"
                  className="button button--icon button--clear button--xsmall"
                  style={{ color: "var(--color-medium)" }}
                  onClick={(event) => removeItem(event, index)}
                >
                  &times;
                </button>
              </div>
              <div>{item.amount} kg/m/L</div>
              <div>
                {formatPrice(item.unitPrice, { minimumFractionDigits: 4 })} por
                kg/m/L
              </div>
              <div>
                {item.quantity} unidade{item.quantity > 1 && `s`}
              </div>
              <div>Preço: {formatPrice(item.price)}</div>
              {!!item.difference && (
                <>
                  <div
                    style={{
                      color: "var(--color-success)",
                      fontWeight: "700",
                    }}
                  >
                    Economia: {formatPrice(item.difference)}
                  </div>
                  <div style={{ fontSize: "0.675rem" }}>
                    (Comparado ao preço mais caro)
                  </div>
                </>
              )}
              {!hasNoDiferrence && isHighestPrice(item) && (
                <div
                  style={{
                    color: "var(--color-danger)",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                  }}
                >
                  Produto mais caro.
                </div>
              )}
            </div>
          ))}

          <div
            onClick={addItem}
            className="card center"
            style={{
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "3rem",
                  lineHeight: 1,
                }}
              >
                &#43;
              </div>
              <div style={{ fontSize: ".75rem" }}>Adicionar um produto</div>
            </div>
          </div>
        </div>
      </section>

      {modalShow && (
        <section
          className={`modal ${modalShow && "modal--active"}`}
          onClick={() => setModalShow(false)}
        >
          <div className="container" onClick={(e) => e.stopPropagation()}>
            <div className="modal__content">
              <button
                className="modal__close-button button button--icon button--clear"
                onClick={() => setModalShow(false)}
              >
                &times;
              </button>

              {formData && (
                <section style={{ padding: 0 }}>
                  <form
                    style={{ display: "grid", gap: "2rem" }}
                    onSubmit={submitItem}
                  >
                    <fieldset style={{ display: "grid", gap: "1.5rem" }}>
                      <div className="card__row">
                        <label className="label">Marca (opcional)</label>
                        <input
                          name="name"
                          type="text"
                          value={formData.name}
                          placeholder={`Produto ${formData.id}`}
                          onChange={changeItem}
                        />
                      </div>
                      <div className="card__row">
                        <label className="label">Unidades (opicional)</label>
                        <input
                          name="quantity"
                          type="number"
                          value={formData.quantity}
                          min={1}
                          step={1}
                          placeholder="Digite a quantidade de unidades do produto"
                          required
                          onChange={changeItem}
                        />
                      </div>
                      <div className="card__row">
                        <label className="label">Volume (kg/m/L)</label>
                        <input
                          name="amount"
                          type="number"
                          value={formData.amount}
                          min={1}
                          step={0.1}
                          placeholder="Digite o volume, tamanho ou peso do produto"
                          required
                          autoFocus={true}
                          onChange={changeItem}
                        />
                      </div>
                      <div className="card__row">
                        <label className="label">Preço R$</label>
                        <input
                          name="price"
                          type="number"
                          value={formData.price}
                          min={0.05}
                          step={0.05}
                          placeholder="0,00"
                          required
                          onChange={changeItem}
                        />
                      </div>
                    </fieldset>

                    <button className="button button--primary">
                      Adicionar produto
                    </button>
                  </form>
                </section>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Index;

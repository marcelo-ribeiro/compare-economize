import Head from "next/head";
import { FormEvent, useRef, useState } from "react";

const generateId = new (function () {
  let id = 1;
  this.get = () => id++;
  this.reset = () => (id = 0);
})();

type TDefaultItem = {
  id: number;
  name: string;
  price: number;
  amount: number | string;
  quantity: number | string;
  unitPrice?: number;
  diferrence?: number;
};

const getDefaultItem = (): TDefaultItem => ({
  id: generateId.get(),
  name: "",
  price: null,
  amount: "",
  quantity: 1,
  unitPrice: 0,
  diferrence: 0,
});

const formatPrice = (price: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "BRL",
  }).format(price);

const Index = () => {
  const [items, setItems] = useState<TDefaultItem[]>([]);
  const [resultItems, setResultItems] = useState<any[]>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [formData, setFormData] = useState<TDefaultItem>();

  const addItem = () => {
    setModalShow(true);
    const data = getDefaultItem();
    setFormData(data);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((item, i) => i !== index));
  };

  const changeItem = (event) => {
    const { name, value, valueAsNumber, type } = event.target;
    const newValue = type === "number" ? valueAsNumber || "" : value;
    setFormData((item) => ({ ...item, [name]: newValue }));
  };

  const submitItem = (event: FormEvent) => {
    event.preventDefault();
    const map = calculate({ ...formData });
    console.log({ map });
    setItems(map);
    setModalShow(false);
  };

  const calculate = (data: any) => {
    const getUnitPrice = (item: any) =>
      item.price / (item.amount * item.quantity);

    data = {
      ...data,
      name: data.name || `Produto ${++data.id}`,
      unitPrice: getUnitPrice(data),
    };

    const _items = items?.length ? [...items, data] : [data];

    if (_items.length > 1) {
      _items.sort((a, b) => a.unitPrice - b.unitPrice);
      _items.forEach((item, index, array) => {
        item.diferrence = getPriceDifference(item, array);
      });
    }

    return _items;
  };

  const reset = () => {
    generateId.reset();
    setItems([]);
    setIsReady(false);
  };

  const hasNoDiferrence = (array: any) => {
    return array?.every((item: any) => item.diferrence === 0);
  };

  const getPriceDifference = (item: any, array: any) => {
    const highestItem = [...array].pop();
    const comparedPrice = highestItem.unitPrice * item.amount * item.quantity;
    const difference = comparedPrice - item.price;
    return difference || 0;
  };

  const isLowestPrice = (item: any) => {
    if (!items?.length) return false;
    console.log({ item, items });
    return item.id === items[0].id;
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

      {items?.length >= 2 ? (
        <section
          className="container"
          style={{ display: "grid", gap: "0.5rem", textAlign: "center" }}
        >
          {hasNoDiferrence([...items]) ? (
            <h3 className="color--success">
              Não há diferença de preço entre os produtos.
            </h3>
          ) : (
            <>
              <h3>{items[0].name} é o produto mais barato.</h3>
              <h3 className="color--success">
                {`Você economizou ${formatPrice(items[0].diferrence)}`}
              </h3>
            </>
          )}
        </section>
      ) : (
        <section
          className="container"
          style={{
            display: "grid",
            gap: "0.5rem",
            textAlign: "center",
          }}
        >
          {!items.length ? (
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
      )}

      <section style={{ display: "grid", gap: "1rem" }}>
        {items?.length >= 2 && (
          <p
            className="container"
            style={{
              margin: 0,
              color: "var(--color-medium)",
              fontSize: "0.75rem",
            }}
          >
            Ordenado pelo mais barato:
          </p>
        )}

        <div className="cards">
          {items?.map((item, index) => (
            <div
              className={`card ${isLowestPrice(item) ? "active" : ""}`}
              style={{ fontSize: "0.875rem" }}
              key={index}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong>{item.name}</strong>

                <button
                  type="button"
                  className="button button--icon button--clear button--xsmall"
                  style={{ color: "var(--color-medium)" }}
                  onClick={() => removeItem(index)}
                >
                  &times;
                </button>
              </div>
              <div>
                {item.quantity} unidade{item.quantity > 1 && `s`}
              </div>
              <div>{item.amount} kg/m/L</div>
              <div>{formatPrice(item.unitPrice)} kg/m/L</div>
              <div>Preço: {formatPrice(item.price)}</div>
              {items.length >= 2 && (
                <div
                  style={{
                    textDecoration: item.diferrence === 0 ? "line-through" : "",
                    color: !!item.diferrence ? "var(--color-success)" : "",
                    fontWeight: !!item.diferrence ? "700" : "",
                  }}
                >
                  Economia: {formatPrice(item.diferrence)}
                </div>
              )}
            </div>
          ))}

          <div
            onClick={addItem}
            className="card"
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
                <section style={{ padding: ".5rem 0 1rem" }}>
                  <form
                    style={{ display: "grid", gap: "1rem" }}
                    onSubmit={submitItem}
                  >
                    {/* <fieldset> */}
                    <div className="card__row">
                      <label className="label">Nome</label>
                      <input
                        name="name"
                        type="text"
                        value={formData.name}
                        placeholder={`Produto ${formData.id}`}
                        onChange={changeItem}
                      />
                    </div>
                    <div className="card__row">
                      <label className="label">Tamanho (kg/m/L)</label>
                      <input
                        name="amount"
                        type="number"
                        value={formData.amount}
                        min={1}
                        step={0.1}
                        placeholder="1"
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
                    <div className="card__row">
                      <label className="label">Unidades</label>
                      <input
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        min={1}
                        step={1}
                        placeholder="1"
                        required
                        onChange={changeItem}
                      />
                    </div>
                    {/* </fieldset> */}

                    <button className="button">Adicionar</button>
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

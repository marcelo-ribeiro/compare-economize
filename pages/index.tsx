import Head from "next/head";
import { FormEvent, useRef, useState } from "react";

const defaultItem = {
  name: "",
  price: "",
  amount: "",
  quantity: "",
  unitPrice: 0,
};

const generateId = new (function () {
  let id = 0;
  this.reset = () => (id = 0);
  this.get = () => ++id;
})();

const getDefaultItems = () =>
  new Map([
    [generateId.get(), { ...defaultItem }],
    [generateId.get(), { ...defaultItem }],
  ]);

const defaultItems = getDefaultItems();

const formatPrice = (price) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "BRL",
  }).format(price);

const Index = () => {
  const [items, setItems] = useState<Map<number, any>>(defaultItems);
  const [resultItems, setResultItems] = useState<any[]>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const form = useRef(null);

  const addItem = () => {
    setItems((items) =>
      new Map(items).set(generateId.get(), { ...defaultItem })
    );
  };

  const removeItem = (index: number) => {
    if (items.size === 2) return;
    setItems((prev) => {
      const next = new Map(prev);
      next.delete(index);
      return next;
    });
  };

  const changeItem = (event, index: number, item: object) => {
    const { name, value, valueAsNumber, type } = event.target;
    item[name] = type === "number" ? valueAsNumber : value;
    setItems((items) => new Map(items).set(index, item));
  };

  const calculate = () => {
    const getUnitPrice = (item: any) =>
      item.price / (item.amount * item.quantity);
    const map = Array.from(items)
      .map(([id, item]) => ({
        ...item,
        id,
        name: item.name || `Produto ${id}`,
        unitPrice: getUnitPrice(item),
      }))
      .sort((a, b) => a.unitPrice - b.unitPrice)
      .map((item, index, array) => ({
        ...item,
        diferrence: getPriceDifference(item, array),
      }));
    setResultItems(map);
    setIsReady(true);
    setModalShow(true);
  };

  const submit = (event = null) => {
    if (!form.current.checkValidity()) return;
    event?.preventDefault();
    calculate();
  };

  const reset = () => {
    generateId.reset();
    setItems(getDefaultItems());
    setResultItems(null);
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
    if (!resultItems?.length) return false;
    console.log({ item, resultItems });
    return item.id === resultItems[0].id;
  };

  return (
    <main>
      <Head>
        <title>Compare produtos</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
      </Head>

      <header className="app-header">
        <nav>
          <button
            type="button"
            onClick={reset}
            className="button button--clear button--small"
          >
            Limpar
          </button>
        </nav>

        <h1>Compare produtos</h1>

        <nav
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
        </nav>
      </header>

      <section style={{ padding: ".5rem 0 1rem" }}>
        <form ref={form} style={{ display: "grid", gap: 24 }} onSubmit={submit}>
          <div className="cards">
            {Array.from(items).map(([key, item]) => (
              <fieldset
                className={`card ${
                  !hasNoDiferrence(resultItems) &&
                  isLowestPrice({ ...item, id: key })
                    ? "active"
                    : ""
                }`}
                key={key}
              >
                <div className="card__row">
                  <label className="label">Nome</label>
                  <input
                    name="name"
                    type="text"
                    value={item.name}
                    placeholder={`Produto ${key}`}
                    onChange={(event) => changeItem(event, key, item)}
                  />
                </div>
                <div className="card__row">
                  <label className="label">kg/m/L</label>
                  <input
                    name="amount"
                    type="number"
                    value={item.amount}
                    min={1}
                    step={0.1}
                    placeholder="1"
                    required
                    onChange={(event) => changeItem(event, key, item)}
                  />
                </div>
                <div className="card__row">
                  <label className="label">Unidades</label>
                  <input
                    name="quantity"
                    type="number"
                    value={item.quantity}
                    min={1}
                    step={1}
                    placeholder="1"
                    required
                    onChange={(event) => changeItem(event, key, item)}
                  />
                </div>
                <div className="card__row">
                  <label className="label">Preço R$</label>
                  <input
                    name="price"
                    type="number"
                    value={item.price}
                    min={0.05}
                    step={0.05}
                    placeholder="0,00"
                    required
                    onChange={(event) => changeItem(event, key, item)}
                  />
                </div>
                {items.size > 2 && (
                  <div className="card__button">
                    <button
                      className="button button--icon button--clear button--xsmall"
                      type="button"
                      onClick={() => removeItem(key)}
                    >
                      &times;
                    </button>
                  </div>
                )}
              </fieldset>
            ))}
          </div>
          <div className="container" style={{ display: "grid", gap: "1rem" }}>
            <button
              type="submit"
              className="button button--primary button--full"
            >
              Comparar
            </button>
          </div>
        </form>
      </section>

      <section
        className={`modal ${modalShow && "modal--active"}`}
        onClick={() => setModalShow(false)}
      >
        <div className="container">
          <div className="modal__content">
            {resultItems && (
              <section className="result" style={{ display: "grid", gap: 16 }}>
                <button className="modal__close-button button button--icon button--clear">
                  &times;
                </button>

                <h2>Resultado</h2>

                {hasNoDiferrence(resultItems) ? (
                  <h3 className="color--success">
                    Não há diferença de preço entre os produtos.
                  </h3>
                ) : (
                  <>
                    <h3>
                      {resultItems[0].name} é o produto mais barato.
                      <br />
                      <span className="color--success">
                        {`Você economizou ${formatPrice(
                          resultItems[0].diferrence
                        )}`}
                      </span>
                    </h3>
                    <p style={{ margin: 0 }}>Ordenado pelo mais barato:</p>
                    <ul>
                      {resultItems?.map((item, index) => (
                        <li key={index}>
                          <div>
                            <strong>{item.name}</strong>
                          </div>
                          <div>{item.quantity} unidades</div>
                          <div>{item.amount} kg/m/L</div>
                          <div>{formatPrice(item.unitPrice)} kg/m/L</div>
                          <div>Preço: {formatPrice(item.price)}</div>
                          <div>
                            {!!item.diferrence &&
                              `Economia: ${formatPrice(item.diferrence)}`}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </section>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;

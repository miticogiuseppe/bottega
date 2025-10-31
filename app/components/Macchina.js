"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
const Spkapexcharts = dynamic(
  () =>
    import(
      "../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts"
    ),
  { ssr: false }
);
const Macchina = ({
  nome,
  fileStorico,
  appmerce,
  graficoTS,
  graficoMacchina,
}) => {
  return (
    <div className="macchina-page">
      <h2>{nome}</h2>

      <section>
        <h4>Storico</h4>
        <Link href={fileStorico} download>
          Scarica STORICO.xlsx
        </Link>
      </section>

      <section>
        <h4>APPMERCE</h4>
        <ul>
          <li>Ordini ricevuti: {appmerce.ordini}</li>
          <li>Imballaggi previsti: {appmerce.imballaggi}</li>
          <li>Ultima consegna: {appmerce.dataConsegna}</li>
        </ul>
      </section>

      <section>
        <h4>Grafico TS AZIENDA</h4>
        <Spkapexcharts
          chartOptions={graficoTS.options}
          chartSeries={graficoTS.series}
          type={graficoTS.options.chart.type}
          width="100%"
          height={315}
        />
      </section>

      <section>
        <h4>Grafico MACCHINA</h4>
        <Spkapexcharts
          chartOptions={graficoMacchina.options}
          chartSeries={graficoMacchina.series}
          type={graficoMacchina.options.chart.type}
          width="100%"
          height={315}
        />
      </section>
    </div>
  );
};

export default Macchina;

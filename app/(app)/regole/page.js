"use client";

import { useState } from "react";

function Switch({ defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className={`switch${on ? " on" : ""}`} onClick={() => setOn(!on)}>
      <div className="knob"></div>
    </div>
  );
}

function SliderSetting({ label, min, max, defaultValue, suffix }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="setting-item">
      <label>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <div className="val">
        {value}
        {suffix}
      </div>
    </div>
  );
}

export default function RegolePage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Regole</h1>
          <div className="sub">Personalizza le soglie secondo il processo della tua azienda</div>
        </div>
      </div>
      <div className="panel">
        <div className="settings-grid">
          <SliderSetting
            label="Giorni di stagnazione prima dell'alert"
            min={5}
            max={45}
            defaultValue={20}
            suffix=" giorni"
          />
          <SliderSetting
            label="Soglia capacity risorsa (%)"
            min={60}
            max={100}
            defaultValue={85}
            suffix="%"
          />
          <div className="setting-item">
            <div className="toggle-row">
              <label style={{ margin: 0 }}>Alert su ritorno da QA</label>
              <Switch defaultOn={true} />
            </div>
          </div>
          <div className="setting-item">
            <div className="toggle-row">
              <label style={{ margin: 0 }}>Alert su quarter scaduto</label>
              <Switch defaultOn={true} />
            </div>
          </div>
        </div>
      </div>
      <div className="footnote">
        Questa pagina è al momento solo dimostrativa: le modifiche non vengono salvate. Diventerà
        funzionante quando decideremo insieme dove memorizzare queste impostazioni.
      </div>
    </>
  );
}

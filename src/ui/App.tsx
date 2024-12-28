import { useEffect, useState } from "react";
import { baseForm } from "../misc/baseForm";
import html from "../misc/templateIndividual.html?raw"
import finalHtml from "../misc/templateFinal.html?raw"
import './App.css'
import { Button, Checkbox, createTheme, InputAdornment, MenuItem, Select, SelectChangeEvent, TextField, ThemeProvider } from '@mui/material'
import { ValorNutricional } from "../misc/interfaces/valorNutricional.interface";
import { TablaSabor } from "../misc/interfaces/tabla.interface";

function App() {
  const [formedHTML, setFormedHTML] =  useState("");
  const [tablas, setTablas] = useState<TablaSabor[]>([{valoresNutricionales: baseForm, id: "1", nombre:'Sabor 1'}])
  const [variosSabores, setVariosSabores] = useState<boolean>(false)
  const [selectedTable, setSelectedTable] = useState("1")

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const resetForm = () => {
    setTablas([{valoresNutricionales: baseForm, id: "1", nombre:"Sabor 1"}])
    actualizarValorExternamente(false)
    setSelectedTable("1")
    generateTable(baseForm)
  }

  useEffect(() => {
    generateTable()
  },[])

  const handleChangeTabla = (event: SelectChangeEvent) => {
    setSelectedTable(event.target.value)
    generateTable(tablas.find((x)=> x.id === event.target.value)?.valoresNutricionales)
  }

  const setNombreSaborTabla = (id: string, newName: string) => {
    setTablas((prevTablas) =>
      prevTablas.map((tabla) =>
        tabla.id === id ? { ...tabla, nombre: newName } : tabla
      )
    );
  };

  const actualizarValorExternamente = (nuevoValor:boolean) => {
    setVariosSabores(nuevoValor);
  };
  
  const nuevoSabor = () => {
    setTablas((prevTablas) => {
      const nextId = (prevTablas.length + 1).toString();
      const newTabla = { valoresNutricionales: baseForm, id: nextId, nombre: 'Sabor ' + nextId };
      const updatedTablas = [...prevTablas, newTabla];
      
      // Actualizar selectedTable usando el nuevo ID
      setSelectedTable(nextId);
  
      return updatedTablas;
    });
  };

  const setDataAndTable = (order: number, valorPorcion: string, valorCDR: string) => {
    // Actualiza el estado de las tablas
    setTablas((prevTablas) => {
      const updatedTablas = prevTablas.map((tabla) => {
        if (tabla.id === selectedTable) {
          const updatedValoresNutricionales = tabla.valoresNutricionales.map((row) =>
            row.order === order
              ? { ...row, valorPorcion, valorCDR }
              : row 
          );
          return {
            ...tabla,
            valoresNutricionales: updatedValoresNutricionales,
          };
        }
        return tabla;
      });
      return updatedTablas;
    });
  
    const currentTable = tablas.find((tabla) => tabla.id === selectedTable);
    if (currentTable) {
      const updatedTableData = currentTable.valoresNutricionales.map((row) =>
        row.order === order
          ? { ...row, valorPorcion, valorCDR }
          : row
      );
      generateTable(updatedTableData);
    }
  };
  
  const generateForm = () => {
    return (
      <div className="left">
        <div className="row">
          <div className="label" ><Button color="error" variant="contained" onClick={resetForm}>Reiniciar tablas</Button></div>
          <div className="porcion">
            Varios sabores
            <Checkbox checked={variosSabores} value={variosSabores} onChange={() => actualizarValorExternamente(!variosSabores)}/>
          </div>
          <div className="cdr" >{ variosSabores ? <Button color="success" variant="contained" onClick={nuevoSabor}>Nuevo sabor</Button> : <></>}</div>
        </div>
        {
        variosSabores?
        <div className="row" >
              <div className="label" >Sabor</div>
              <div className="porcion">
                <TextField
                  value={tablas.find((x) => x.id === selectedTable)?.nombre}
                  hiddenLabel
                  id="filled-hidden-label-small"
                  variant="outlined"
                  style={{width:'100%'}}
                  size="small"
                  label="Nombre del sabor"
                  onChange={(e) => {
                    setNombreSaborTabla(selectedTable, e.target.value)
                  }}
                />
              </div>
              <div className="cdr">
                  <Select
                    value={selectedTable} 
                    onChange={handleChangeTabla}
                    style={{width: "230px"}}
                    size="small"
                    variant="outlined"
                    defaultValue={selectedTable}
                  >
                    {tablas.map((x) => (
                      <MenuItem value={x.id}>{x.nombre}</MenuItem>
                    ))}
                  </Select>
              </div>
          </div>
          : <></>
          }

        {tablas.find((x) => x.id === selectedTable)?.valoresNutricionales.map((x) => {
          return (
            <div className="row" key={x.order}>
              <div className="label" >{x.label}</div>
              <div className="porcion">
                <TextField
                  value={x.valorPorcion}
                  slotProps={ x.unidadPorcion ?{
                    input: {
                      endAdornment: <InputAdornment position="end">{x.unidadPorcion}</InputAdornment>,
                    },
                  } : {}}
                  hiddenLabel
                  id="filled-hidden-label-small"
                  variant="filled"
                  size="small"
                  onChange={(e) => {
                    setDataAndTable(x.order, e.target.value, x.valorCDR)
                  }}
                />
              </div>
              <div className="cdr">
                <TextField
                  value={x.valorCDR}
                  slotProps={ x.unidadCDR ?{
                    input: {
                      endAdornment: <InputAdornment position="end">{x.unidadCDR}</InputAdornment>,
                    },
                  } : {}}
                  hiddenLabel
                  id="filled-hidden-label-small"
                  variant="filled"
                  size="small"
                  onChange={(e) => {
                    setDataAndTable(x.order, x.valorPorcion, e.target.value)
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const copyToClipboard = (saveToFile: boolean = false) => {
    let finalTable = ''
    let htmlFinalCopy = finalHtml
    let selector = tablas.length > 1 ? `
      <select id="table-selector">
        ${tablas.map( (tabla) => `<option value="${tabla.id}">${tabla.nombre}</option>`)}
      </select>` : ''
    tablas.forEach((tabla) => {
      let tablaCompost = 
      `
      <table class="table${tabla.id === "1" ? ' active' : ''}" id="${tabla.id}">
      <tbody>
        <tr>
          <td class="bg-white">&nbsp;</td>
          <td>Por porción</td>
          <td>%CDR</td>
        </tr>
        <tr>
          <td colspan="3">Información nutricional para el producto en sabor neutro.</td>
        </tr>
        ${tabla.valoresNutricionales.map((valorNutri) => `
        <tr>
          <td>
            ${valorNutri.bold ? `<strong>${valorNutri.label}</strong>` : valorNutri.label}
          </td>
          <td>
            <span class="serving">${valorNutri.valorPorcion}</span>
            <span>${valorNutri.unidadPorcion}</span>
          </td>
          <td>
            <span>${valorNutri.valorCDR}</span>
            <span>${valorNutri.unidadCDR}</span>
          </td>
        </tr>
        `).join('')}
      </tbody>
      </table>
     `

      finalTable = finalTable + tablaCompost
    })
    htmlFinalCopy = htmlFinalCopy.replace("{1}", selector)
    htmlFinalCopy = htmlFinalCopy.replace("{0}", finalTable)
    navigator.clipboard.writeText(htmlFinalCopy)
    }

  const generateTable = (baseFormTemp? :ValorNutricional[]) => {
    let finalTable = ''
    let htmlCopy = html
    const tablaFound = tablas.find((x) => x.id === selectedTable)?.valoresNutricionales;

    const valoresNutricionales = baseFormTemp || tablaFound || [];
    valoresNutricionales.forEach((x) => {
      let row = `
      <tr>
        <td>
          ${x.bold ? `<strong>${x.label}</strong>` : x.label}
        </td>
        <td>
          <span class="serving">${x.valorPorcion}</span>
          <span>${x.unidadPorcion}</span>
        </td>
        <td>
          <span>${x.valorCDR}</span>
          <span>${x.unidadCDR}</span>
        </td>
      </tr>`
      finalTable = finalTable + row
    })
    setFormedHTML(htmlCopy.replace("{0}", finalTable))
  }


  return (
    <>
      <ThemeProvider theme={darkTheme}>
      <header className="header">
        <h1>Generador de tablas HTML</h1>
      </header>
      <div className="content">
        {generateForm()}
        <div className="right">
        <div dangerouslySetInnerHTML={{__html: formedHTML}} >
        </div>
        <Button color="success" variant="contained" onClick={() => copyToClipboard(false)}>Copiar al portapapeles</Button>
        </div>
      </div>
      </ThemeProvider>
     </>
  )
}

export default App

import { useEffect, useState } from "react";
import { baseForm } from "../misc/baseForm";
import html from "../misc/templateIndividual.html?raw"
import finalHtml from "../misc/templateFinal.html?raw"
import './App.css'
import { Button, Checkbox, createTheme, IconButton, InputAdornment, MenuItem, Select, SelectChangeEvent, TextField, ThemeProvider } from '@mui/material'
import { ValorNutricional } from "../misc/interfaces/valorNutricional.interface";
import { TablaSabor } from "../misc/interfaces/tabla.interface";
import Delete from '@mui/icons-material/Delete';
import FormatBoldIcon from '@mui/icons-material/FormatBold';

function App() {
  const [formedHTML, setFormedHTML] =  useState("");
  const [tablas, setTablas] = useState<TablaSabor[]>([{valoresNutricionales: baseForm, id: "1", nombre:'Sabor 1', ingredientes: ""}])
  const [variosSabores, setVariosSabores] = useState<boolean>(false)
  const [selectedTable, setSelectedTable] = useState("1")

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
    
  });

  const resetForm = () => {
    setTablas([{valoresNutricionales: baseForm, id: "1", nombre:"Sabor 1", ingredientes: ""}])
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

  const setIngredientesTabla = (id: string, ingredientes: string) => {
    console.log(ingredientes)
    setTablas((prevTablas) =>
      prevTablas.map((tabla) =>
        tabla.id === id ? { ...tabla, ingredientes: ingredientes } : tabla
      )
    );
  };


  const actualizarValorExternamente = (nuevoValor:boolean) => {
    setVariosSabores(nuevoValor);
  };
  
  const nuevoSabor = () => {
    setTablas((prevTablas) => {
      const nextId = (prevTablas.length + 1).toString();
      const tablaCopiada = prevTablas[prevTablas.length - 1]
      const newTabla = { ...tablaCopiada, id: nextId, nombre: 'Sabor ' + nextId };
      const updatedTablas = [...prevTablas, newTabla];
      
      // Actualizar selectedTable usando el nuevo ID
      setSelectedTable(nextId);
  
      return updatedTablas;
    });
  };

  const setDataAndTable = (order: number, label: string,valorPorcion: string, valorCDR: string, unidadPorcion: string, unidadCDR:string) => {
    // Actualiza el estado de las tablas
    setTablas((prevTablas) => {
      const updatedTablas = prevTablas.map((tabla) => {
        if (tabla.id === selectedTable) {
          const updatedValoresNutricionales = tabla.valoresNutricionales.map((row) =>
            row.order === order
              ? { ...row, label, valorPorcion, valorCDR, unidadPorcion, unidadCDR}
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
          ? { ...row, label, valorPorcion, valorCDR, unidadPorcion, unidadCDR }
          : row
      );
      generateTable(updatedTableData);
    }
  };

  const cambiarBoldValorNutricional = (
    order: number,
): void => {
    // Actualizar las tablas
    const tablasActualizadas = tablas.map((tabla) => {
        if (tabla.id === selectedTable) {
            // Modificar el valor nutricional que coincide con el order
            const valoresActualizados = tabla.valoresNutricionales.map((valor) => {
                if (valor.order === order) {
                    return {
                        ...valor,
                        bold: !valor.bold, // Cambiar el estado de bold
                    };
                }
                return valor;
            });
            return {
                ...tabla,
                valoresNutricionales: valoresActualizados,
            };
        }
        return tabla;
    });

    setTablas(tablasActualizadas);

    const tablaModificada = tablasActualizadas.find((tabla) => tabla.id === selectedTable);

    if (tablaModificada) {
        generateTable(tablaModificada.valoresNutricionales);
    } else {
        console.error("No se encontró la tabla modificada para pasar a generateTable.");
    }
}

  const deleteRow = (order: number) => {
    const tablasActualizadas = tablas.map((tabla) => {
      if (tabla.id === selectedTable) {
          const valoresActualizados = tabla.valoresNutricionales.filter(
              (valor) => valor.order !== order
          );
          return {
              ...tabla,
              valoresNutricionales: valoresActualizados,
          };
      }
      return tabla;
  });

  setTablas(tablasActualizadas);
  const tablaModificada = tablasActualizadas.find((tabla) => tabla.id === selectedTable);

  if (tablaModificada) {
      generateTable(tablaModificada.valoresNutricionales);
  } else {
      console.error("No se encontró la tabla modificada para pasar a generateTable.");
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
              <div className="label" >   
                <TextField
                  value={x.label}
                  hiddenLabel
                  id="filled-hidden-label-small"
                  variant="filled"
                  size="small"
                  slotProps={ x.unidadPorcion ?{
                    input: {
                      endAdornment:<InputAdornment position="end">
                          <IconButton
                            onClick={() => deleteRow(x.order)}
                            edge="end"
                          >
                            <Delete></Delete>
                          </IconButton>
                          <IconButton
                            onClick={() => cambiarBoldValorNutricional(x.order)}
                            edge="end"
                          >
                            <FormatBoldIcon color={x.bold ? "info" : "disabled"}></FormatBoldIcon>
                          </IconButton>
                        </InputAdornment>
                      
                    },
                  } : {}}
                  onChange={(e) => {
                    setDataAndTable(x.order, e.target.value, x.valorPorcion, x.valorCDR, x.unidadPorcion, x.unidadCDR)
                  }}
                /></div>
              <div className="porcion">
              <TextField
                value={x.valorPorcion}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <TextField
                          value={x.unidadPorcion}
                          onChange={(e) => {
                            setDataAndTable(x.order, x.label, x.valorPorcion, x.valorCDR, e.target.value, x.unidadCDR);
                          }}
                          variant="standard"
                          size="small"
                          inputProps={{
                            style: { textAlign: "center", width: "40px" }, 
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                hiddenLabel
                id="filled-hidden-label-small"
                variant="filled"
                size="small"
                onChange={(e) => {
                  setDataAndTable(x.order, x.label, e.target.value, x.valorCDR, x.unidadPorcion, x.unidadCDR);
                }}
              />
              </div>
              <div className="cdr">
                <TextField
                  value={x.valorCDR}
                  slotProps={ x.unidadCDR ?{
                    input: {
                      endAdornment:   
                      <InputAdornment position="end">
                      <TextField
                        value={x.unidadCDR}
                        onChange={(e) => {
                          setDataAndTable(x.order, x.label, x.valorPorcion, x.valorCDR, x.unidadPorcion, e.target.value);
                        }}
                        variant="standard"
                        size="small"
                        inputProps={{
                          style: { textAlign: "center", width: "40px" }, 
                        }}
                      />
                    </InputAdornment>,
                    },
                  } : {}}
                  hiddenLabel
                  id="filled-hidden-label-small"
                  variant="filled"
                  size="small"
                  onChange={(e) => {
                    setDataAndTable(x.order, x.label, x.valorPorcion, e.target.value, x.unidadPorcion, x.unidadCDR)
                  }}
                />
              </div>
            </div>
          )
        })}
        <div className="row">
          <TextField
                  value={tablas.find((x) => x.id === selectedTable)?.ingredientes}
                  id="filled-hidden-label-small"
                  multiline
                  rows={3}
                  variant="outlined"
                  className="full-row"
                  style={{width:'100%', marginTop: 50}}
                  label="Ingredientes"
                  onChange={(e) => {
                    setIngredientesTabla(selectedTable, e.target.value)
                  }}

            />
        </div>
      </div>
    )
  }

  const copyToClipboard = () => {
    let finalTable = ''
    let htmlFinalCopy = finalHtml
    let selector = tablas.length > 1 ? `
        <select id="flavor-selector" class="flavor-selector">
        ${tablas.map( (tabla) => `<option value="${tabla.id}">${tabla.nombre}</option>`)}
      </select>` : ''
    tablas.forEach((tabla) => {
      let tablaCompost = 
      `
      <div class="table${tabla.id === "1" ? ' active' : ''}" id="${tabla.id}">
      <table class="nutrition-table">
      <thead>
      <tr>

          <th class="grande">Información nutricional</th>

          <th>100gr</th>

          <th>Por servicio</th>

      </tr>
      </thead>
      <tbody id="nutrition-table">

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
      <div class="ingredients">
          <h6>Ingredientes</h6>
          <p>
            ${tabla.ingredientes}
          </p>
      </div>
      </div>
     `
      finalTable = finalTable + tablaCompost
    })
    htmlFinalCopy = htmlFinalCopy.replace("{1}", selector)
    htmlFinalCopy = htmlFinalCopy.replace("{0}", finalTable)
    htmlFinalCopy = htmlFinalCopy.replace("{2}", tablas.length > 1 ? "Elige un sabor" : "Información Nutricional")
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
        <Button color="success" variant="contained" onClick={copyToClipboard}>Copiar al portapapeles</Button>
        </div>
      </div>
      </ThemeProvider>
     </>
  )
}

export default App

"use client";
import { useEffect, useState } from "react";
import { getEmployees } from "../../services/api";
import "./page.css";

export interface Employee {
  id: number;
  image: string;
  name: string;
  job: string;
  admission_date: string;
  phone: string;
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(dateString));
}

function formatPhone(phone: string): string {
  return phone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+$1 ($2) $3-$4");
}

export default function TablePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchEmployees() {
      const data: Employee[] = await getEmployees();
      setEmployees(data);
      setFilteredEmployees(data);
    }
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filteredEmployees = employees.filter((employee) =>
      [employee.name, employee.job, employee.phone].some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredEmployees(filteredEmployees);
  }, [searchTerm, employees]);

  const toggleRowExpansion = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="alignThinks">
      <div className="searchRow">
        <h1>Funcionários</h1>
        <div className="searchInput">
          <input
            type="text"
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img src="icon/search.svg" alt="Pesquisar" />
        </div>
      </div>
      <main className="App">
        <table>
          <thead>
            <tr>
              <th>
                <h2>FOTO</h2>
              </th>
              <th>
                <h2>NOME</h2>
              </th>
              <th>{screenWidth >= 768 && <h2>CARGO</h2>}</th>
              {screenWidth >= 768 && (
                <>
                  <th>
                    <h2>DATA DE ADMISSÃO</h2>
                  </th>
                  <th>
                    <h2>TELEFONE</h2>
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <>
                <tr key={employee.id}>
                  <td>
                    <img
                      src={employee.image}
                      alt={employee.name}
                      className="employeeImgs"
                    />
                  </td>
                  <td>
                    <h3>{employee.name}</h3>
                  </td>
                  {screenWidth >= 768 ? (
                    <>
                      <td>
                        <h3>{employee.job}</h3>
                      </td>
                      <td>
                        <h3>{formatDate(employee.admission_date)}</h3>
                      </td>
                      <td>
                        <h3>{formatPhone(employee.phone)}</h3>
                      </td>
                    </>
                  ) : (
                    <td className="td-btn-details">
                      <button onClick={() => toggleRowExpansion(employee.id)}>
                        <img
                          style={{
                            transform: expandedRows.includes(employee.id)
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                          src="icon/details.svg"
                          alt="Detalhes"
                        />
                      </button>
                    </td>
                  )}
                </tr>
                {expandedRows.includes(employee.id) && screenWidth < 768 && (
                  <tr className="expanded-row">
                    <td className="td-expanded">
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <h2>Cargo</h2>
                              <h3>{employee.job}</h3>
                            </td>
                            <td>
                              <h2>Data de admissão</h2>
                              <h3>{formatDate(employee.admission_date)}</h3>
                            </td>
                            <td>
                              <h2>Telefone</h2>
                              <h3>{formatPhone(employee.phone)}</h3>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

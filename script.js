//var allMembers = data.results[0].members;
let init = {
  headers: {
    "X-API-Key": "pMskw3hi8j1kapSDxt2QxxJdsADg8g7xNu30g5hh",
  },
};

const fetchMembers = (chamber) => {
  fetch(
    `https://api.propublica.org/congress/v1/113/${chamber}/members.json`,
    init
  )
    .then((res) => res.json())
    .then((json) => {
      let allMembers = [...json.results[0].members];
      runApp(allMembers);
    })
    .catch((error) => console.log(error));
};

function prueba() {
  console.log("PRUEBA");
}

if (
  document.title == "TGIF - House Data" ||
  document.title == "TGIF - House Attendance" ||
  document.title == "TGIF - House Loyalty"
) {
  fetchMembers("house");
} else if (
  document.title == "TGIF - Senate Data" ||
  document.title == "TGIF - Senate Attendance" ||
  document.title == "TGIF - Senate Loyalty"
) {
  fetchMembers("senate");
} else {
  document.getElementById("accordion").addEventListener("click", (e) => {
    ////ACA VA MI BOTON  READ MORE/ READ LESS
    e.target.innerText =
      e.target.innerText == "Read More..." ? "Read Less..." : "Read More...";
  });
}
const runApp = (allMembers) => {
  switch (document.title) {
    case "TGIF - Home":
      break;

    case "TGIF - House Data":
    case "TGIF - Senate Data":
      var partyFilter = ["D", "R", "ID"];
      var stateFilter = "all";
      var membersShown = [];

      function allFilters() {
        if (stateFilter == "all") {
          membersShown = allMembers;
        } else {
          membersShown = allMembers.filter(
            (member) => member.state === stateFilter
          );
        }

        if (partyFilter.length > 0) {
          membersShown = membersShown.filter((member) =>
            partyFilter.includes(member.party)
          );
        }
      }
      //RENDERIZADO DE LA TABLA
      function printTable() {
        document.getElementById("tbodyData").innerHTML = "";
        allFilters();

        membersShown.forEach((member) => {
          const elementoTr = document.createElement("tr");
          elementoTr.innerHTML = `<td><a href="${
            member.url
          }" "target="_blank">${member.last_name} ${member.first_name} ${
            member.middle_name || ""
          }</a></td>
    <td>${member.party}</td>
    <td>${member.state}</td>
    <td>${member.seniority}</td>
    <td>${member.votes_with_party_pct.toFixed(2)}%</td>
    `;

          document.getElementById("tbodyData").appendChild(elementoTr);
        });
      }

      //     SECCION DE SCRIPT REFERENTE A ESTADOS     //

      //LLENAR MI INPUT SELECT DE ESTADOS - ITERACION - INDEXOF
      let estadosFiltrados = [];

      allMembers.forEach((member) => {
        if (estadosFiltrados.indexOf(member.state) === -1) {
          estadosFiltrados.push(member.state);
        }
      });

      estadosFiltrados.sort();

      //AGREGO CADA OPTION A MI INPUT SELECT, SIN REPETIRLOS - ITERACION
      estadosFiltrados.forEach((estado) => {
        let option = document.createElement("option");
        option.innerText = estado;
        option.value = estado;
        document.getElementById("selectStates").appendChild(option);
      });

      printTable();
      //LE PASO EL VALOR DE POR QUE ESTADO ESTARE FILTRANDO POR MEDIO DEL INPUT + e.target.value
      document
        .getElementById("selectStates")
        .addEventListener("change", (e) => {
          stateFilter = e.target.value;

          printTable();
        });

      //     SECCION DE SCRIPT REFERENTE A PARTIDOS   //

      let inputs = document.getElementsByName("party");

      inputs = Array.from(inputs);

      //ITERO ENTRE LOS INPUTS (3) Y POR CADA UNO AGREGO UN EVENT LISTENER QUE EJECUTA UNA FUNCION
      inputs.forEach((input) => {
        input.addEventListener("change", (e) => {
          let chosen = e.target.value;
          if (partyFilter.includes(chosen)) {
            partyFilter = partyFilter.filter((party) => party !== chosen);
            console.log(partyFilter);
          } else {
            partyFilter.push(chosen);
            console.log(partyFilter);
          }
          printTable();
        });
      });

      break;

    case "TGIF - Senate Attendance":
    case "TGIF - House Attendance":
    case "TGIF - Senate Loyalty":
    case "TGIF - House Loyalty":
      let statistics = {
        democrats: [],
        republicans: [],
        independents: [],
        mostEngaged: [],
        leastEngaged: [],
        mostLoyal: [],
        leastLoyal: [],
      };

      statistics.democrats = allMembers.filter((member) => member.party == "D");
      statistics.republicans = allMembers.filter(
        (member) => member.party == "R"
      );
      statistics.independents = allMembers.filter(
        (member) => member.party == "ID"
      );

      let partyQuantity = []; //INICIALIZO UN ARRAY VACIO

      allMembers.forEach((member) => {
        // LLENO EL ARRAY VACIO CON EL NUMERO DE PARTIDOS DISPONIBLES EN ESTA
        if (partyQuantity.indexOf(member.party) === -1) {
          partyQuantity.push(member.party);
        }
      });
      //FUNCION QUE ME RETORNA EL PORCENTAJE REQUERIDO PARA TODO EL PARTIDO Y EL TOTAL DE MIEMBROS
      function getPctYTotal(party, pct) {
        // retorna PTCs y TOTAL de miembros por partido
        let pctTotal = 0; // inicializo la variable en 0
        party.forEach((member) => {
          pctTotal = pctTotal + member[pct]; //busco el valor de la propiedad que le paso por parametro
        });
        if (pctTotal) {
          pctTotal = (pctTotal / party.length).toFixed(2);
        }
        return parseFloat(pctTotal);
      }

      // DEMOCRATS MISSED VOTES % - VOTES W/ PARTY %
      statistics.democratsMissedPct = getPctYTotal(
        statistics.democrats,
        "missed_votes_pct"
      );

      statistics.democratsVotesWPartyPct = getPctYTotal(
        statistics.democrats,
        "votes_with_party_pct"
      );

      // REPUBLICANS MISSED VOTES % - VOTES W/ PARTY %

      statistics.republicansMissedPct = getPctYTotal(
        statistics.republicans,
        "missed_votes_pct"
      );

      statistics.republicansVotesWPartyPct = getPctYTotal(
        statistics.republicans,
        "votes_with_party_pct"
      );

      // INDEPENDENTS MISSED VOTES % - VOTES W/ PARTY %

      statistics.independentsMissedPct = getPctYTotal(
        statistics.independents,
        "missed_votes_pct"
      );

      statistics.independentsVotesWPartyPct = getPctYTotal(
        statistics.independents,
        "votes_with_party_pct"
      );

      //TOTAL DE MIEMBOS DE LA CAMARA Y PROMEDIO DE PCTS

      statistics.totalChamberMembers =
        statistics.democrats.length +
        statistics.independents.length +
        statistics.republicans.length;

      statistics.totalMissedVotes = (
        (statistics.democratsMissedPct +
          statistics.republicansMissedPct +
          statistics.independentsMissedPct) /
        partyQuantity.length
      ).toFixed(2);

      statistics.totalVotesWParty = (
        (statistics.democratsVotesWPartyPct +
          statistics.republicansVotesWPartyPct +
          statistics.independentsVotesWPartyPct) /
        partyQuantity.length
      ).toFixed(2);

      //CALCULOS PARA TABLAS DE ATTENDANCE Y LOYALTY
      let tenPercent = Math.ceil(allMembers.length / 10);
      //HAGO EL CALCULO DE PARTY_VOTES A PARTIR DE TOTAL VOTES Y VOTES W/ PARTY PCT
      allMembers.forEach((member) => {
        member.party_votes = Math.round(
          (member.votes_with_party_pct *
            (member.total_votes - member.missed_votes)) /
            100
        );
      });

      statistics.leastEngaged = allMembers
        .filter((member) => member.total_votes !== 0)
        .sort((a, b) => b.missed_votes_pct - a.missed_votes_pct)
        .slice(0, tenPercent);

      statistics.mostEngaged = allMembers
        .filter((member) => member.total_votes !== 0)
        .sort((a, b) => a.missed_votes_pct - b.missed_votes_pct)
        .slice(0, tenPercent);

      statistics.leastLoyal = allMembers
        .filter((member) => member.total_votes !== 0)
        .sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct)
        .slice(0, tenPercent);
      statistics.mostLoyal = allMembers
        .filter((member) => member.total_votes !== 0)
        .sort((a, b) => b.votes_with_party_pct - a.votes_with_party_pct)
        .slice(0, tenPercent);

      //FUNCION QUE RENDERIZA TABLA DE HOUSE AT GLANCE
      function printAtGlanceTable(
        party,
        members,
        pct,
        id,
        totalReps,
        totalPct
      ) {
        let fila = document.getElementById(id);
        let filaTotal = document.getElementById("total");
        fila.innerHTML = `<td style="font-weight:bold">${party}</td><td>${members.length}</td><td>${pct}%</td>`;
        filaTotal.innerHTML = `<td style="font-weight:bold">Total</td><td>${totalReps}</td><td>${totalPct}%</td>`;
      }
      //FUNCION QUE RENDERIZA LEAST & MOST TABLES
      function printLeastAndMostTable(params, id) {
        params.forEach((member) => {
          let tr = document.createElement("tr");
          tr.innerHTML = `<td><a href="${member.url}" "target="_blank">${
            member.last_name
          } ${member.first_name} ${member.middle_name || ""}</a></td>
        <td>${
          params == statistics.leastEngaged || params == statistics.mostEngaged
            ? member.missed_votes
            : member.party_votes
        }</td>
        <td>${
          params == statistics.leastEngaged || params == statistics.mostEngaged
            ? member.missed_votes_pct.toFixed(2)
            : member.votes_with_party_pct
        }%</td>`;

          document.getElementById(id).appendChild(tr);
        });
      }

      if (
        document.title == "TGIF - Senate Attendance" ||
        document.title == "TGIF - House Attendance"
      ) {
        printAtGlanceTable(
          "Democrats",
          statistics.democrats,
          statistics.democratsMissedPct,
          "democrats",
          statistics.totalChamberMembers,
          statistics.totalMissedVotes
        );
        printAtGlanceTable(
          "Republicans",
          statistics.republicans,
          statistics.republicansMissedPct,
          "republicans",
          statistics.totalChamberMembers,
          statistics.totalMissedVotes
        );
        printAtGlanceTable(
          "Independents",
          statistics.independents,
          statistics.independentsMissedPct,
          "independents",
          statistics.totalChamberMembers,
          statistics.totalMissedVotes
        );

        printLeastAndMostTable(statistics.leastEngaged, "least");
        printLeastAndMostTable(statistics.mostEngaged, "most");
      } else if (
        document.title == "TGIF - Senate Loyalty" ||
        document.title == "TGIF - House Loyalty"
      ) {
        printAtGlanceTable(
          "Democrats",
          statistics.democrats,
          statistics.democratsVotesWPartyPct,
          "democrats",
          statistics.totalChamberMembers,
          statistics.totalVotesWParty
        );
        printAtGlanceTable(
          "Republicans",
          statistics.republicans,
          statistics.republicansVotesWPartyPct,
          "republicans",
          statistics.totalChamberMembers,
          statistics.totalVotesWParty
        );
        printAtGlanceTable(
          "Independents",
          statistics.independents,
          statistics.independentsVotesWPartyPct,
          "independents",
          statistics.totalChamberMembers,
          statistics.totalVotesWParty
        );
        printLeastAndMostTable(statistics.leastLoyal, "least");
        printLeastAndMostTable(statistics.mostLoyal, "most");
      }
      break;
  }
};

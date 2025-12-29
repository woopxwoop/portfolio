class AbyssTeam {
  version;
  members;
  usage_rate_top;
  usage_rate_bottom;
  usage_total;

  constructor(version, members, usage_rate_top, usage_rate_bottom, usage_total){
    this.version = version;
    this.members = members.map(({member}) => {return dataToCharacter(member)});
    this.usage_rate_top = usage_rate_top;
    this.usage_rate_bottom = usage_rate_bottom;
    this.usage_total = usage_total;
  }
}

class Character {
  name;
  rarity;
  icon;

  constructor(name, rarity, icon){
    this.name = name;
    this.rarity = rarity;
    this.icon = icon;
  }
}

function fetchAbyssTeams(){
  let teams;

  let teamsHTML = ""; 
  fetch("https://lightkeepers-backend.vercel.app/teams").then((res)=>res.json()).then((data)=>{

    data.forEach((team) => {
      teamsHTML += getTeamHTML(team);
    })

    const abyssDiv = document.querySelector("#abyss-team");
    abyssDiv.innerHTML = teamsHTML;
  })

}

function getTeamHTML(data){
  let team = "";
  data.members.forEach((member) => {
    team += `<img src = "${member.icon}"></img>`;
  })
  return `<div> ${team} </div> <br/>`;
}

function dataToCharacter(data){
  return new Character(data.name, data.rarity, data.icon);
}


fetchAbyssTeams();
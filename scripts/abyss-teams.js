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

const payload = {
  character_names: [
    "Xiangling","Furina","Bennett","Sucrose","Fischl",
    "Chevreuse","Varesa","Iansan","Mavuika","Yelan",
    "Xingqiu","Durin","Kaedehara Kazuha"
  ],
  version: 53,
  num_teams: 100
};

function fetchAbyssTeams(){
  let teams;

  let teamsHTML = ""; 

  fetch("https://lightkeepers-backend.vercel.app/db-test-3",{
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then((res)=>res.json()).then((data)=>{

    data.data.forEach((team) => {
      teamsHTML += getTeamHTML(team);
    })

    const abyssDiv = document.querySelector("#abyss-team");
    abyssDiv.innerHTML = teamsHTML;
  })

}

function getTeamHTML(team){
  let teamHTML = "";
  team.members.forEach((member) => {
    teamHTML += `<p>${member}<p>`;
  })
  return `<div> ${teamHTML} </div> <br/>`;
}

function dataToCharacter(data){
  return new Character(data.name, data.rarity, data.icon);
}


fetchAbyssTeams();
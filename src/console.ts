let missionStatus = document.createElement('div');
let missionDescription = document.createElement('p');
missionStatus.appendChild(missionDescription);
document.body.appendChild(missionStatus);

Object.assign(missionStatus.style, {
  position: 'absolute',
  backgroundColor: "black",
  opacity: '0.8',
  color: "green",
  border: "1px solid green",
  maxWidth: 500 + 'px',
  top: 20 + 'px',
  left: 20 + 'px',
});

missionDescription.style.font = "Courier New";

const updateMissionStatus = () => {
  let glitchText = '';
  for (let i = 0; i < 490; i++) {
    glitchText += String.fromCharCode(0x30A0 + Math.random() * (0x30FF - 0x30A0 + 1));
  }
  missionStatus.innerHTML = glitchText;
}

export { updateMissionStatus, missionDescription };
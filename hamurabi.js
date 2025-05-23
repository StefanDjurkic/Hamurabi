<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hamurabi in JavaScript with Command Bar</title>
  <style>
    body {
      font-family: monospace;
      background-color: #f0f0f0;
      margin: 0;
      padding: 20px;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    /* Container for the game text output and sidebar */
    .container {
      display: flex;
      flex: 1;
      margin-bottom: 10px;
    }
    /* Game output area */
    #output {
      flex: 2;
      background-color: #fff;
      border: 1px solid #ccc;
      padding: 10px;
      margin-right: 20px;
      overflow-y: auto;
      white-space: pre-wrap;
    }
    /* Stats sidebar */
    #stats {
      flex: 1;
      background-color: #e0f7fa;
      border: 1px solid #ccc;
      padding: 10px;
      overflow-y: auto;
    }
    /* Command bar area styling */
    #inputArea {
      display: flex;
      align-items: center;
    }
    #inputField {
      flex: 1;
      font-size: 1em;
      padding: 5px;
      margin-right: 10px;
    }
    #submitBtn {
      padding: 5px 10px;
      font-size: 1em;
    }
  </style>
</head>
<body>
  <div class="container">
    <div id="output"></div>
    <div id="stats">
      <h3>Resources</h3>
      <p id="popStat">Population: </p>
      <p id="grainStat">Grain Store: </p>
      <p id="acresStat">Acres Owned: </p>
    </div>
  </div>
  <div id="inputArea">
    <input id="inputField" type="text" placeholder="Enter your command here" autocomplete="off" />
    <button id="submitBtn">Submit</button>
  </div>
  
  <script>
    const outputDiv = document.getElementById("output");
    const inputField = document.getElementById("inputField");
    const submitBtn = document.getElementById("submitBtn");
    
    // Stat display elements
    const popStat = document.getElementById("popStat");
    const grainStat = document.getElementById("grainStat");
    const acresStat = document.getElementById("acresStat");

    // Helper function for output
    function print(line) {
      outputDiv.textContent += line + "\n";
      outputDiv.scrollTop = outputDiv.scrollHeight;
    }
    
    // Function to update the sidebar stats
    function updateStats(population, grainStore, acresOwned) {
      popStat.textContent = "Population: " + population;
      grainStat.textContent = "Grain Store: " + grainStore;
      acresStat.textContent = "Acres Owned: " + acresOwned;
    }

    // awaitInput now returns a trimmed string using either the Submit button or the Enter key.
    function awaitInput(promptText) {
      return new Promise(resolve => {
        print("\n" + promptText);
        inputField.value = "";
        inputField.focus();

        // Handler for submission:
        function submitHandler() {
          const ans = inputField.value.trim();
          print("> " + ans);
          // Clean up event listeners for both enter key and click.
          submitBtn.removeEventListener("click", submitHandler);
          inputField.removeEventListener("keydown", keydownHandler);
          resolve(ans);
        }
        
        // Keydown handler to allow pressing Enter.
        function keydownHandler(e) {
          if (e.key === "Enter") {
            submitHandler();
          }
        }
        
        submitBtn.addEventListener("click", submitHandler);
        inputField.addEventListener("keydown", keydownHandler);
      });
    }
    
    // Validate numeric input; reprompt until valid.
    async function getValidNumber(promptText, conditionFunc) {
      let value, num;
      while (true) {
        let answer = await awaitInput(promptText);
        num = parseInt(answer, 10);
        if (isNaN(num)) {
          print("HAMURABI:  I CANNOT DO WHAT YOU WISH. PLEASE ENTER A VALID NUMBER.");
          continue;
        }
        if (conditionFunc && !conditionFunc(num)) {
          continue;
        }
        value = num;
        break;
      }
      return value;
    }
    
    // Main game logic:
    async function hamurabiGame() {
      // Introductory messages:
      print("                                HAMURABI");
      print("               CREATIVE COMPUTING  MORRISTOWN, NEW JERSEY");
      print("\n\n");
      print("TRY YOUR HAND AT GOVERNING ANCIENT SUMERIA");
      print("FOR A TEN-YEAR TERM OF OFFICE.\n");
      
      // Initialize game state:
      let year = 0;
      let starvedTotal = 0;
      let population = 95;
      let grainStore = 2800;
      let land = 3000;   
      let acresOwned = Math.floor(land / 3);
      let yieldPerAcre = 3;
      let ratsAte = 0;
      
      // Initial update of stats sidebar:
      updateStats(population, grainStore, acresOwned);
      
      // Main game loop: 10 years
      for (year = 1; year <= 10; year++) {
        print("\nHAMURABI:  I BEG TO REPORT TO YOU,");
        print("IN YEAR " + year + ",");
        
        // Starvation simulation:
        let starved = Math.floor(Math.random() * (population / 10));
        print(starved + " PEOPLE STARVED, 5 CAME TO THE CITY,");
        population = population - starved + 5;
        starvedTotal += starved;
        print("POPULATION IS NOW " + population);
        
        print("THE CITY NOW OWNS " + acresOwned + " ACRES.");
        print("YOU HARVESTED " + yieldPerAcre + " BUSHELS PER ACRE.");
        ratsAte = Math.floor(grainStore * 0.1);
        print("THE RATS ATE " + ratsAte + " BUSHELS.");
        print("YOU NOW HAVE " + grainStore + " BUSHELS IN STORE.\n");
        
        // Update stats sidebar:
        updateStats(population, grainStore, acresOwned);
        
        // End game after 10 years:
        if (year === 10) break;
        
        // Land trade: determine price per acre (between 17 and 26 bushels)
        let pricePerAcre = Math.floor(Math.random() * 10) + 17;
        print("LAND IS TRADING AT " + pricePerAcre + " BUSHELS PER ACRE.");
        
        // Ask to buy land.
        let acresToBuy = await getValidNumber("HOW MANY ACRES DO YOU WISH TO BUY?", num => {
          if (num < 0) {
            print("HAMURABI:  I CANNOT DO WHAT YOU WISH.");
            return false;
          }
          if (pricePerAcre * num > grainStore) {
            print("HAMURABI:  THINK AGAIN.  YOU HAVE ONLY " + grainStore + " BUSHELS OF GRAIN.  NOW THEN,");
            return false;
          }
          return true;
        });
        
        if (acresToBuy > 0) {
          acresOwned += acresToBuy;
          grainStore -= pricePerAcre * acresToBuy;
        }
        
        updateStats(population, grainStore, acresOwned);
        
        // Ask to sell land.
        let acresToSell = await getValidNumber("HOW MANY ACRES DO YOU WISH TO SELL?", num => {
          if (num < 0) {
            print("HAMURABI:  I CANNOT DO WHAT YOU WISH.");
            return false;
          }
          if (num > acresOwned) {
            print("HAMURABI:  THINK AGAIN.  YOU OWN ONLY " + acresOwned + " ACRES.  NOW THEN,");
            return false;
          }
          return true;
        });
        if (acresToSell > 0) {
          acresOwned -= acresToSell;
          grainStore += pricePerAcre * acresToSell;
        }
        
        updateStats(population, grainStore, acresOwned);
        
        // Ask to feed the population.
        let grainToFeed = await getValidNumber("HOW MANY BUSHELS DO YOU WISH TO FEED YOUR PEOPLE?", num => {
          if (num < 0) {
            print("HAMURABI:  I CANNOT DO WHAT YOU WISH.");
            return false;
          }
          if (num > grainStore) {
            print("HAMURABI:  THINK AGAIN.  YOU HAVE ONLY " + grainStore + " BUSHELS OF GRAIN.  NOW THEN,");
            return false;
          }
          return true;
        });
        grainStore -= grainToFeed;
        updateStats(population, grainStore, acresOwned);
        
        // Ask to plant grain.
        let acresToPlant = await getValidNumber("HOW MANY ACRES DO YOU WISH TO PLANT WITH SEED?", num => {
          if (num < 0) {
            print("HAMURABI:  I CANNOT DO WHAT YOU WISH.");
            return false;
          }
          if (num > acresOwned) {
            print("HAMURABI:  THINK AGAIN.  YOU OWN ONLY " + acresOwned + " ACRES.  NOW THEN,");
            return false;
          }
          if (num > 10 * population) {
            print("BUT YOU HAVE ONLY " + population + " PEOPLE TO TEND THE FIELDS!  NOW THEN,");
            return false;
          }
          if (Math.ceil(num / 2) > grainStore) { 
            print("HAMURABI:  THINK AGAIN.  YOU DON'T HAVE ENOUGH GRAIN FOR SEED.");
            return false;
          }
          return true;
        });
        // Deduct seed cost: 1 bushel covers 2 acres.
        grainStore -= Math.ceil(acresToPlant / 2);
        updateStats(population, grainStore, acresOwned);
        
        // Determine harvest yield (between 3 and 7 bushels per acre)
        yieldPerAcre = Math.floor(Math.random() * 5) + 3;
        let harvestAmount = acresToPlant * yieldPerAcre;
        print("YOU HARVESTED " + yieldPerAcre + " BUSHELS PER ACRE, FOR A TOTAL OF " + harvestAmount + " BUSHELS.");
        
        // Deduct harvest loss due to rats.
        ratsAte = Math.floor(Math.random() * harvestAmount / 10);
        print("THE RATS ATE " + ratsAte + " BUSHELS.");
        grainStore += (harvestAmount - ratsAte);
        
        // Plague check: 15% chance.
        if (Math.random() < 0.15) {
          print("A HORRIBLE PLAGUE STRUCK!  HALF THE PEOPLE DIED.");
          population = Math.floor(population / 2);
        }
        
        // New births calculation:
        let births = Math.floor((grainStore + acresOwned) / 100) + 1;
        population += births;
        print("NEW BIRTHS: " + births + " PEOPLE. POPULATION IS NOW " + population + ".");
        print("GRAIN IN STORE IS NOW " + grainStore + " BUSHELS.");
        print("ACRES OWNED ARE NOW " + acresOwned + ".\n");
        
        updateStats(population, grainStore, acresOwned);
      } // end game loop
      
      // End-of-term summary:
      let acresPerPerson = Math.floor(acresOwned / population);
      print("\nYOUR 10-YEAR TERM IS OVER.");
      print("FINAL POPULATION: " + population);
      print("ACRES PER PERSON: " + acresPerPerson);
      let avgStarved = Math.floor(starvedTotal / 10);
      print("AVERAGE STARVATION RATE: " + avgStarved + " per year.");
      print("\nSO LONG FOR NOW.");
    }
    
    // Start the game when the page loads.
    hamurabiGame();
  </script>
</body>
</html>

document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const form = document.getElementById("tpCalculatorForm");
  const entityTypeSelect = document.getElementById("entityType");
  const relatedPartyYes = document.getElementById("relatedYes");
  const relatedPartyNo = document.getElementById("relatedNo");
  const connectedPersonYes = document.getElementById("connectedYes");
  const connectedPersonNo = document.getElementById("connectedNo");
  const uaeHQYes = document.getElementById("uaeHQYes");
  const uaeHQNo = document.getElementById("uaeHQNo");
  const outsideUAEYes = document.getElementById("outsideUAEYes");
  const outsideUAENo = document.getElementById("outsideUAENo");
  const isUAEHeadquartered = document.getElementById("isUAEHeadquartered");
  const hasBusinessOutsideUAE = document.getElementById(
    "hasBusinessOutsideUAE"
  );
  const revenueSection = document.getElementById("revenueSection");
  const relatedPartySection = document.getElementById("relatedPartySection");
  const connectedPersonSection = document.getElementById(
    "connectedPersonSection"
  );
  const transactionCategories = document.getElementById(
    "transactionCategories"
  );
  const entityRevenueGroup = document.getElementById("entityRevenueGroup");
  const groupRevenueGroup = document.getElementById("groupRevenueGroup");
  const totalRelatedPartyTransactions = document.getElementById(
    "totalRelatedPartyTransactions"
  );
  const calculateButton = document.getElementById("calculateButton");
  const resetButton = document.getElementById("resetButton");
  const results = document.getElementById("results");
  const resultsContent = document.getElementById("resultsContent");
  const addConnectedPersonButton =
    document.getElementById("addConnectedPerson");
  const connectedPersonsList = document.getElementById("connectedPersonsList");

  // Constants for thresholds (already in millions/billions as per new inputs)
  const THRESHOLDS = {
    RELATED_PARTY_REPORTING: 40, // AED 40 million
    RELATED_PARTY_CATEGORY_DISCLOSURE: 4, // AED 4 million
    CONNECTED_PERSON_DISCLOSURE: 500, // AED 500 thousand
    ENTITY_REVENUE_LOCAL_FILE: 200, // AED 200 million
    MNE_GROUP_REVENUE_MASTER_FILE: 3.15, // AED 3.15 billion
  };

  let connectedPersonCount = 1;

  // Initialize the form
  initializeVisibility();

  // Event Listeners
  entityTypeSelect.addEventListener("change", handleEntityTypeChange);
  relatedPartyYes.addEventListener("change", toggleRelatedPartySection);
  relatedPartyNo.addEventListener("change", toggleRelatedPartySection);
  connectedPersonYes.addEventListener("change", toggleConnectedPersonSection);
  connectedPersonNo.addEventListener("change", toggleConnectedPersonSection);
  uaeHQYes.addEventListener("change", toggleHeadquarterFields);
  uaeHQNo.addEventListener("change", toggleHeadquarterFields);
  totalRelatedPartyTransactions.addEventListener(
    "input",
    toggleTransactionCategories
  );
  calculateButton.addEventListener("click", calculateRequirements);
  resetButton.addEventListener("click", resetForm);
  addConnectedPersonButton.addEventListener("click", addConnectedPerson);

  // Initialize visibility of sections
  function initializeVisibility() {
    // Handle entity type specific visibility
    handleEntityTypeChange();

    // Hide related party and connected person sections initially
    relatedPartySection.style.display = "none";
    connectedPersonSection.style.display = "none";
    transactionCategories.style.display = "none";
    hasBusinessOutsideUAE.style.display = "none";
    results.style.display = "none";
  }

  // Initial setup based on entity type
  function handleEntityTypeChange() {
    const entityType = entityTypeSelect.value;

    // Show/hide specific sections based on entity type
    if (entityType === "exempted" || entityType === "smallBusiness") {
      // For exempted entities or small business relief, hide revenue sections
      revenueSection.style.display = "none";
      isUAEHeadquartered.style.display = "none";
      hasBusinessOutsideUAE.style.display = "none";

      // Reset headquarter related fields
      uaeHQNo.checked = true;
      outsideUAENo.checked = true;
    } else {
      // For other entity types, show all sections
      revenueSection.style.display = "block";
      isUAEHeadquartered.style.display = "block";

      // Show/hide business outside UAE question based on UAE HQ selection
      toggleHeadquarterFields();
    }
  }

  // Toggle Related Party Transaction section visibility
  function toggleRelatedPartySection() {
    if (relatedPartyYes.checked) {
      relatedPartySection.style.display = "block";
    } else {
      relatedPartySection.style.display = "none";
      // Reset related values
      totalRelatedPartyTransactions.value = "";
      document.getElementById("saleOfGoods").value = "";
      document.getElementById("provisionOfServices").value = "";
      document.getElementById("intellectualProperty").value = "";
      document.getElementById("interestTransactions").value = "";
      document.getElementById("otherTransactions").value = "";
    }
  }

  // Toggle Connected Person Transaction section visibility
  function toggleConnectedPersonSection() {
    if (connectedPersonYes.checked) {
      connectedPersonSection.style.display = "block";
    } else {
      connectedPersonSection.style.display = "none";
      // Reset connected persons
      connectedPersonsList.innerHTML = `
                <div class="connected-person-item">
                    <h4>Connected Person 1</h4>
                    <div class="form-group">
                        <label for="connectedPerson1">Value of transactions with Connected Person 1 and their Related Parties:</label>
                        <div class="input-suffix">
                            <input type="number" id="connectedPerson1" name="connectedPerson1" placeholder="Enter amount" min="0" step="0.1">
                            <span class="suffix">AED (thousands)</span>
                        </div>
                    </div>
                </div>
            `;
      connectedPersonCount = 1;
    }
  }

  // Toggle transaction categories visibility based on total related party transactions
  function toggleTransactionCategories() {
    const totalValue = parseFloat(totalRelatedPartyTransactions.value) || 0;

    if (totalValue >= THRESHOLDS.RELATED_PARTY_REPORTING) {
      transactionCategories.style.display = "block";
    } else {
      transactionCategories.style.display = "none";
      // Reset category values
      document.getElementById("saleOfGoods").value = "";
      document.getElementById("provisionOfServices").value = "";
      document.getElementById("intellectualProperty").value = "";
      document.getElementById("interestTransactions").value = "";
      document.getElementById("otherTransactions").value = "";
    }
  }

  // Toggle headquarter fields based on UAE HQ selection
  function toggleHeadquarterFields() {
    // Always show group revenue for non-exempted entities
    const entityType = entityTypeSelect.value;
    if (entityType !== "exempted" && entityType !== "smallBusiness") {
      groupRevenueGroup.style.display = "block";
    } else {
      groupRevenueGroup.style.display = "none";
    }

    // Show business outside UAE question only if UAE HQ is selected
    if (uaeHQYes.checked) {
      hasBusinessOutsideUAE.style.display = "block";
    } else {
      hasBusinessOutsideUAE.style.display = "none";
      outsideUAENo.checked = true;
    }
  }

  // Add another connected person
  function addConnectedPerson() {
    connectedPersonCount++;

    const newConnectedPerson = document.createElement("div");
    newConnectedPerson.classList.add("connected-person-item");
    newConnectedPerson.innerHTML = `
            <h4>Connected Person ${connectedPersonCount}</h4>
            <div class="form-group">
                <label for="connectedPerson${connectedPersonCount}">Value of transactions with Connected Person ${connectedPersonCount} and their Related Parties:</label>
                <div class="input-suffix">
                    <input type="number" id="connectedPerson${connectedPersonCount}" name="connectedPerson${connectedPersonCount}" placeholder="Enter amount" min="0" step="0.1">
                    <span class="suffix">AED (thousands)</span>
                </div>
            </div>
        `;

    connectedPersonsList.appendChild(newConnectedPerson);
  }

  // Reset the form
  function resetForm() {
    form.reset();
    initializeVisibility();
    connectedPersonsList.innerHTML = `
            <div class="connected-person-item">
                <h4>Connected Person 1</h4>
                <div class="form-group">
                    <label for="connectedPerson1">Value of transactions with Connected Person 1 and their Related Parties:</label>
                    <div class="input-suffix">
                        <input type="number" id="connectedPerson1" name="connectedPerson1" placeholder="Enter amount" min="0" step="0.1">
                        <span class="suffix">AED (thousands)</span>
                    </div>
                </div>
            </div>
        `;
    connectedPersonCount = 1;
    results.style.display = "none";
  }

  // Calculate Transfer Pricing requirements
  function calculateRequirements() {
    const entityType = entityTypeSelect.value;
    const hasRelatedPartyTransactions = relatedPartyYes.checked;
    const hasConnectedPersonTransactions = connectedPersonYes.checked;
    const isUAEHQ = uaeHQYes.checked;
    const hasBusinessOutside = outsideUAEYes.checked;

    const entityRevenue =
      parseFloat(document.getElementById("entityRevenue").value) || 0;
    const groupRevenue =
      parseFloat(document.getElementById("groupRevenue").value) || 0;
    const totalRelatedValue =
      parseFloat(totalRelatedPartyTransactions.value) || 0;

    let requirementsHtml = "";
    let localFileRequired = false;
    let masterFileRequired = false;
    let disclosureFormRequired = false;
    let connectedPersonScheduleRequired = false;
    let breakdownCategoriesRequired = false;

    // 1. Check for basic applicability
    let applicabilityHtml = `
            <div class="requirement-item">
                <h4>1. Applicability of Transfer Pricing Provisions</h4>
        `;

    if (!hasRelatedPartyTransactions && !hasConnectedPersonTransactions) {
      applicabilityHtml += `
                <p>Based on your inputs, Transfer Pricing provisions <span class="not-required">do not apply</span> to your entity as you do not have any transactions or arrangements with Related Parties or Connected Persons.</p>
            `;
    } else {
      applicabilityHtml += `
                <p>Based on your inputs, Transfer Pricing provisions <span class="required">apply</span> to your entity as you have transactions or arrangements with Related Parties or Connected Persons.</p>
                <p>Your entity must comply with the Arm's Length Principle for all Related Party transactions and Connected Person payments.</p>
            `;

      disclosureFormRequired = true;
    }

    applicabilityHtml += `</div>`;
    requirementsHtml += applicabilityHtml;

    // 2. Check for disclosure requirements for Related Parties
    if (hasRelatedPartyTransactions) {
      let relatedPartyHtml = `
                <div class="requirement-item">
                    <h4>2. Related Party Transactions Disclosure</h4>
            `;

      if (totalRelatedValue >= THRESHOLDS.RELATED_PARTY_REPORTING) {
        relatedPartyHtml += `
                    <p>Your total Related Party transactions (AED ${formatNumber(
                      totalRelatedValue
                    )} million) <span class="required">exceed the threshold</span> of AED ${formatNumber(
          THRESHOLDS.RELATED_PARTY_REPORTING
        )} million.</p>
                    <p>You are <span class="required">required</span> to complete the Related Party schedule in the Transfer Pricing Disclosure Form.</p>
                `;

        breakdownCategoriesRequired = true;
        relatedPartyHtml += `
                    <p>Additionally, you must disclose each category of Related Party transactions that exceeds AED ${formatNumber(
                      THRESHOLDS.RELATED_PARTY_CATEGORY_DISCLOSURE
                    )} million:</p>
                    <ul>
                `;

        // Check each category
        const saleOfGoods =
          parseFloat(document.getElementById("saleOfGoods").value) || 0;
        const provisionOfServices =
          parseFloat(document.getElementById("provisionOfServices").value) || 0;
        const intellectualProperty =
          parseFloat(document.getElementById("intellectualProperty").value) ||
          0;
        const interestTransactions =
          parseFloat(document.getElementById("interestTransactions").value) ||
          0;
        const otherTransactions =
          parseFloat(document.getElementById("otherTransactions").value) || 0;

        if (saleOfGoods >= THRESHOLDS.RELATED_PARTY_CATEGORY_DISCLOSURE) {
          relatedPartyHtml += `<li>Sale of Goods: AED ${formatNumber(
            saleOfGoods
          )} million - <span class="required">Disclosure Required</span></li>`;
        } else if (saleOfGoods > 0) {
          relatedPartyHtml += `<li>Sale of Goods: AED ${formatNumber(
            saleOfGoods
          )} million - <span class="not-required">No Disclosure Required</span></li>`;
        }

        if (
          provisionOfServices >= THRESHOLDS.RELATED_PARTY_CATEGORY_DISCLOSURE
        ) {
          relatedPartyHtml += `<li>Provision of Services: AED ${formatNumber(
            provisionOfServices
          )} million - <span class="required">Disclosure Required</span></li>`;
        } else if (provisionOfServices > 0) {
          relatedPartyHtml += `<li>Provision of Services: AED ${formatNumber(
            provisionOfServices
          )} million - <span class="not-required">No Disclosure Required</span></li>`;
        }

        if (
          intellectualProperty >= THRESHOLDS.RELATED_PARTY_CATEGORY_DISCLOSURE
        ) {
          relatedPartyHtml += `<li>Intellectual Property: AED ${formatNumber(
            intellectualProperty
          )} million - <span class="required">Disclosure Required</span></li>`;
        } else if (intellectualProperty > 0) {
          relatedPartyHtml += `<li>Intellectual Property: AED ${formatNumber(
            intellectualProperty
          )} million - <span class="not-required">No Disclosure Required</span></li>`;
        }

        if (
          interestTransactions >= THRESHOLDS.RELATED_PARTY_CATEGORY_DISCLOSURE
        ) {
          relatedPartyHtml += `<li>Interest Transactions: AED ${formatNumber(
            interestTransactions
          )} million - <span class="required">Disclosure Required</span></li>`;
        } else if (interestTransactions > 0) {
          relatedPartyHtml += `<li>Interest Transactions: AED ${formatNumber(
            interestTransactions
          )} million - <span class="not-required">No Disclosure Required</span></li>`;
        }

        if (otherTransactions >= THRESHOLDS.RELATED_PARTY_CATEGORY_DISCLOSURE) {
          relatedPartyHtml += `<li>Other Transactions: AED ${formatNumber(
            otherTransactions
          )} million - <span class="required">Disclosure Required</span></li>`;
        } else if (otherTransactions > 0) {
          relatedPartyHtml += `<li>Other Transactions: AED ${formatNumber(
            otherTransactions
          )} million - <span class="not-required">No Disclosure Required</span></li>`;
        }

        relatedPartyHtml += `</ul>`;
      } else {
        relatedPartyHtml += `
                    <p>Your total Related Party transactions (AED ${formatNumber(
                      totalRelatedValue
                    )} million) <span class="not-required">do not exceed the threshold</span> of AED ${formatNumber(
          THRESHOLDS.RELATED_PARTY_REPORTING
        )} million.</p>
                    <p>You are <span class="not-required">not required</span> to complete the Related Party schedule in the Transfer Pricing Disclosure Form.</p>
                    <p>However, you must still comply with the Arm's Length Principle and maintain appropriate documentation.</p>
                `;
      }

      relatedPartyHtml += `</div>`;
      requirementsHtml += relatedPartyHtml;
    }

    // 3. Check for disclosure requirements for Connected Persons
    if (hasConnectedPersonTransactions) {
      let connectedPersonHtml = `
                <div class="requirement-item">
                    <h4>3. Connected Person Transactions Disclosure</h4>
                    <p>Transactions with Connected Persons require disclosure if the value exceeds AED ${formatNumber(
                      THRESHOLDS.CONNECTED_PERSON_DISCLOSURE
                    )} thousand per Connected Person.</p>
                    <ul>
            `;

      let anyConnectedPersonExceedsThreshold = false;

      // Check each connected person's transaction value
      for (let i = 1; i <= connectedPersonCount; i++) {
        const connectedPersonValue =
          parseFloat(document.getElementById(`connectedPerson${i}`).value) || 0;

        if (connectedPersonValue >= THRESHOLDS.CONNECTED_PERSON_DISCLOSURE) {
          connectedPersonHtml += `<li>Connected Person ${i}: AED ${formatNumber(
            connectedPersonValue
          )} thousand - <span class="required">Disclosure Required</span></li>`;
          anyConnectedPersonExceedsThreshold = true;
          connectedPersonScheduleRequired = true;
        } else {
          connectedPersonHtml += `<li>Connected Person ${i}: AED ${formatNumber(
            connectedPersonValue
          )} thousand - <span class="not-required">No Disclosure Required</span></li>`;
        }
      }

      connectedPersonHtml += `</ul>`;

      if (anyConnectedPersonExceedsThreshold) {
        connectedPersonHtml += `<p>You are <span class="required">required</span> to complete the Connected Person schedule in the Transfer Pricing Disclosure Form for the transactions that exceed the threshold.</p>`;
      } else {
        connectedPersonHtml += `<p>You are <span class="not-required">not required</span> to complete the Connected Person schedule in the Transfer Pricing Disclosure Form as none of your transactions exceed the threshold.</p>`;
      }

      connectedPersonHtml += `</div>`;
      requirementsHtml += connectedPersonHtml;
    }

    // 4. Check Local File and Master File requirements
    if (entityType !== "exempted" && entityType !== "smallBusiness") {
      let documentationHtml = `
                <div class="requirement-item">
                    <h4>4. Local File and Master File Requirements</h4>
            `;

      // Check if Local File is required
      if (
        entityRevenue >= THRESHOLDS.ENTITY_REVENUE_LOCAL_FILE ||
        groupRevenue >= THRESHOLDS.MNE_GROUP_REVENUE_MASTER_FILE
      ) {
        localFileRequired = true;
        documentationHtml += `
                    <p>Based on your inputs:</p>
                    <ul>
                `;

        if (entityRevenue >= THRESHOLDS.ENTITY_REVENUE_LOCAL_FILE) {
          documentationHtml += `
                        <li>Your entity's revenue (AED ${formatNumber(
                          entityRevenue
                        )} million) <span class="required">exceeds</span> the threshold of AED ${formatNumber(
            THRESHOLDS.ENTITY_REVENUE_LOCAL_FILE
          )} million</li>
                    `;
        }

        if (groupRevenue >= THRESHOLDS.MNE_GROUP_REVENUE_MASTER_FILE) {
          documentationHtml += `
                        <li>Your MNE group's consolidated revenue (AED ${formatNumber(
                          groupRevenue
                        )} billion) <span class="required">exceeds</span> the threshold of AED ${formatNumber(
            THRESHOLDS.MNE_GROUP_REVENUE_MASTER_FILE
          )} billion</li>
                    `;

          // Check if MNE has business outside UAE (is truly multinational)
          if (isUAEHQ && !hasBusinessOutside) {
            documentationHtml += `
                            <li>Your group is headquartered in the UAE and does not have business establishments outside the UAE</li>
                        `;
            masterFileRequired = false;
          } else {
            masterFileRequired = true;
          }
        }

        documentationHtml += `</ul>`;

        if (localFileRequired) {
          documentationHtml += `<p>You are <span class="required">required</span> to prepare and maintain a <strong>Local File</strong>.</p>`;
        } else {
          documentationHtml += `<p>You are <span class="not-required">not required</span> to prepare and maintain a Local File.</p>`;
        }

        if (masterFileRequired) {
          documentationHtml += `<p>You are <span class="required">required</span> to prepare and maintain a <strong>Master File</strong>.</p>`;
        } else {
          documentationHtml += `<p>You are <span class="not-required">not required</span> to prepare and maintain a Master File.</p>`;
        }
      } else {
        documentationHtml += `
                    <p>Based on your inputs:</p>
                    <ul>
                        <li>Your entity's revenue (AED ${formatNumber(
                          entityRevenue
                        )} million) <span class="not-required">does not exceed</span> the threshold of AED ${formatNumber(
          THRESHOLDS.ENTITY_REVENUE_LOCAL_FILE
        )} million</li>
                `;

        documentationHtml += `
                    <li>Your group's consolidated revenue (AED ${formatNumber(
                      groupRevenue
                    )} billion) <span class="not-required">does not exceed</span> the threshold of AED ${formatNumber(
          THRESHOLDS.MNE_GROUP_REVENUE_MASTER_FILE
        )} billion</li>
                `;

        documentationHtml += `</ul>`;
        documentationHtml += `<p>You are <span class="not-required">not required</span> to prepare and maintain a Local File or Master File.</p>`;
      }

      documentationHtml += `</div>`;
      requirementsHtml += documentationHtml;
    } else {
      // For exempted entities or small business relief
      let documentationHtml = `
                <div class="requirement-item">
                    <h4>4. Local File and Master File Requirements</h4>
                    <p>As an ${
                      entityType === "exempted"
                        ? "Exempted Entity"
                        : "Entity Claiming Small Business Relief"
                    }, you are <span class="not-required">not required</span> to prepare and maintain a Local File or Master File.</p>
                    <p>However, you must still comply with the Arm's Length Principle and maintain appropriate documentation to support your transfer pricing positions.</p>
                </div>
            `;
      requirementsHtml += documentationHtml;
    }

    // 5. Add Summary Section
    let summaryHtml = `
            <div class="requirement-item summary">
                <h4>Summary of Transfer Pricing Requirements</h4>
                <ul>
        `;

    if (hasRelatedPartyTransactions || hasConnectedPersonTransactions) {
      summaryHtml += `<li>Arm's Length Principle: <span class="required">Required</span> for all Related Party transactions and Connected Person payments</li>`;

      if (disclosureFormRequired) {
        summaryHtml += `<li>Transfer Pricing Disclosure Form: <span class="required">Required</span></li>`;

        if (breakdownCategoriesRequired) {
          summaryHtml += `<li>Related Party Schedule with Breakdown by Categories: <span class="required">Required</span></li>`;
        } else if (hasRelatedPartyTransactions) {
          summaryHtml += `<li>Related Party Schedule: <span class="not-required">Not Required</span> (below threshold)</li>`;
        }

        if (connectedPersonScheduleRequired) {
          summaryHtml += `<li>Connected Person Schedule: <span class="required">Required</span> for transactions exceeding threshold</li>`;
        } else if (hasConnectedPersonTransactions) {
          summaryHtml += `<li>Connected Person Schedule: <span class="not-required">Not Required</span> (below threshold)</li>`;
        }
      } else {
        summaryHtml += `<li>Transfer Pricing Disclosure Form: <span class="not-required">Not Required</span> (below thresholds)</li>`;
      }
    } else {
      summaryHtml += `<li>Transfer Pricing Regulations: <span class="not-required">Not Applicable</span> (no Related Party or Connected Person transactions)</li>`;
    }

    if (entityType !== "exempted" && entityType !== "smallBusiness") {
      if (localFileRequired) {
        summaryHtml += `<li>Local File: <span class="required">Required</span></li>`;
      } else {
        summaryHtml += `<li>Local File: <span class="not-required">Not Required</span></li>`;
      }

      if (masterFileRequired) {
        summaryHtml += `<li>Master File: <span class="required">Required</span></li>`;
      } else {
        summaryHtml += `<li>Master File: <span class="not-required">Not Required</span></li>`;
      }
    } else {
      summaryHtml += `<li>Local File and Master File: <span class="not-required">Not Required</span> (${
        entityType === "exempted" ? "Exempted Entity" : "Small Business Relief"
      })</li>`;
    }

    summaryHtml += `
                </ul>
                <div class="disclaimer">
                    <p>This calculator provides general guidance based on the information provided. The actual requirements may vary based on specific circumstances and the interpretation of tax authorities. It is recommended to consult with a qualified tax professional for personalized advice.</p>
                </div>
            </div>
        `;

    requirementsHtml += summaryHtml;

    // Display results
    resultsContent.innerHTML = requirementsHtml;
    results.style.display = "block";

    // Scroll to results
    results.scrollIntoView({ behavior: "smooth" });
  }

  // Helper function to format numbers with commas
  function formatNumber(number) {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    });
  }
});

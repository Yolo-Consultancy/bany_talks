/**
 * Google Sheets Integration Service
 * Uses the user's authorized OAuth access token to write and read data.
 */

export interface GoogleSpreadsheetInfo {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

/**
 * Extract Spreadsheet ID from a URL or return the input directly if it is already an ID.
 */
export const extractSpreadsheetId = (input: string): string => {
  const trimmed = input.trim();
  if (!trimmed) return '';
  
  // URL format: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit...
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
};

/**
 * Fetch the title of the first tab in a Google Sheet.
 */
export const getFirstSheetTitle = async (spreadsheetId: string, accessToken: string): Promise<string> => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Impossible de récupérer les informations de la feuille Google Sheets : ${text}`);
  }
  const data = await response.json();
  const title = data.sheets?.[0]?.properties?.title || 'Sheet1';
  return title;
};

/**
 * Create a new brand-dedicated Google Spreadsheet and initialize its headers.
 */
export const createNewSpreadsheet = async (accessToken: string, title: string = "Bany Talks - Demandes d'Invitations"): Promise<GoogleSpreadsheetInfo> => {
  const url = 'https://sheets.googleapis.com/v4/spreadsheets';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      properties: {
        title: title,
      },
      sheets: [
        {
          properties: {
            title: "Demandes",
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erreur lors de la création de la feuille de calcul : ${text}`);
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Initialize headers on the freshly created "Demandes" sheet
  await initializeHeaders(spreadsheetId, accessToken, "Demandes");

  return {
    spreadsheetId,
    spreadsheetUrl,
    title,
  };
};

/**
 * Initialize column headers in the specified Google Sheet.
 */
export const initializeHeaders = async (spreadsheetId: string, accessToken: string, sheetTitle: string): Promise<void> => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A1:J1?valueInputOption=USER_ENTERED`;
  const headers = [
    'ID Réservation',
    'Organisme / Entreprise',
    'Nom Complet',
    'Adresse Email',
    'Type d\'Événement / Collaborations',
    'Date d\'Exécution',
    'Budget Alloué',
    'Offre/Option Validée',
    'Brief / Message / Objectifs',
    'Date d\'Enregistrement (UTC)'
  ];

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      values: [headers],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Impossible d'initialiser les en-têtes de la feuille : ${text}`);
  }
};

/**
 * Appends a row of data to the Google Sheet.
 */
export const appendRowToSheet = async (
  spreadsheetId: string,
  accessToken: string,
  rowData: string[]
): Promise<void> => {
  // Discover first sheet tab title dynamically (adhering to best practices)
  let sheetTitle = 'Demandes';
  try {
    sheetTitle = await getFirstSheetTitle(spreadsheetId, accessToken);
  } catch (err) {
    console.warn('Discovery failed, using default "Demandes" sheet title:', err);
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A:J:append?valueInputOption=USER_ENTERED`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      values: [rowData],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erreur lors de l'ajout des données de réservation dans la feuille : ${text}`);
  }
};

Das Projekt 'Filmrezensionsanalyse' entstand im Rahmen des Kurses ‚Annotationen mit Sprachmodellen‘, einer Übung im Master Informationsverarbeitung der Universität zu Köln. 
Ziel der Übung war es, die Leistung von LLMs in bestimmten Bereichen zu überprüfen.

Für dieses Projekt wurde mixtral-8x7b verwendet. Ziel hierbei war es, herauszufinden inwiefern Mixtral textbasierte Filmrezensionen bewerten auf einer Punkteskala kann. Dabei ging es darum, dass Mixtral einschätzen sollte, wie gut der Film ‘Star Wars - The Force Awakens (2015)’ der Person gefallen hat, die die Rezension verfasst hat. 

Als Trainingsdaten wurden gescrappte Rezensionen der Plattform 1MDB verwendet. Diese Rezensionen sind auf Englisch und bewerten den Film anhand eines textbasierten Kommentars, sowie einer Punktebewertung von1-10 (1 wäre dabei sehr schlecht, 10 sehr gut). Die gescrappten Kommentare wurden mit ID's versehen und in Trainingsgruppen a 30 Kommentare eingeteilt, so dass am Ende 13 Trainingsgruppen vorhanden waren. Außerdem wurde die Punktebewertung entfernt. Aufgabe des LLMS war es nun, die Punktebewertung anhand des textbasierten Kommentars vorherzusagen.

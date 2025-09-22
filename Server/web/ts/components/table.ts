export class Table {

    Element: HTMLElement;
    HeaderRow: HTMLElement;
    RowContainer: HTMLElement;

    Data: any[][] = [];

    constructor(data: any[][] = []) {

        this.Element = document.createElement("div");
        this.Element.classList.add("table");

        this.HeaderRow = document.createElement("div");
        this.HeaderRow.classList.add("tableheader");

        this.RowContainer = document.createElement("div");
        this.RowContainer.classList.add("tablerowcontainer");

        this.Element.appendChild(this.HeaderRow);
        this.Element.appendChild(this.RowContainer);

        this.Parse(data);
        this.AddEvents();
    }

    Parse(data: object[][]) {

        this.Data = data;

        this.HeaderRow.replaceChildren();
        this.RowContainer.replaceChildren();

        let numRows = data.length;

        if (numRows === 0) {
            return;
        }

        let headerRow = data[0];
        let numCols = headerRow.length;

        if (numCols === 0) {
            return;
        }

        for (let col = 0; col < numCols; col++) {

            let columnHeaderEl = document.createElement("div");
            columnHeaderEl.classList.add("tablecolumnheader");
            columnHeaderEl.innerText = headerRow[col].toString();
            this.HeaderRow.appendChild(columnHeaderEl);
        }

        for (let row = 1; row < numRows; row++) {

            let rowData = data[row];

            let rowEl = document.createElement("div");
            rowEl.classList.add("tablerow");

            for (let col = 0; col < numCols; col++) {

                let cellEl = document.createElement("div");
                cellEl.classList.add("tablecell");

                if (col < rowData.length) {
                    cellEl.innerText = rowData[col].toString();
                }

                rowEl.appendChild(cellEl);
            }

            this.RowContainer.appendChild(rowEl);
        }
    }

    AddEvents() {

    }
}
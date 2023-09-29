import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import 'ag-grid-enterprise'
import { ColDef, GetContextMenuItemsParams, GridReadyEvent, ICellRendererParams, MenuItemDef, RichCellEditorParams, RowDoubleClickedEvent, RowValueChangedEvent, ValueParserParams } from 'ag-grid-community';
import { API_URL } from 'config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  constructor(private router: Router){}
  public columnDefs: ColDef[] = [
    { field: 'productId', hide: true},
    { field: 'name', filter: 'agTextColumnFilter', floatingFilter: true},
    { field: 'sku', filter: 'agTextColumnFilter', floatingFilter: true},
    { field: 'price', filter: 'agNumberColumnFilter', floatingFilter: true, valueFormatter: params => `$ ${params.value}`},
    { field: 'description', filter: 'agTextColumnFilter', floatingFilter: true },
    { field: 'uom', filter: 'agSetColumnFilter', floatingFilter: true, sortable: true},
    { field: 'expiry', filter: 'agDateColumnFilter', floatingFilter: true, sortable: true},
    { field: 'active', filter: true, floatingFilter: true, sortable: true, valueGetter: params => params.data.active ? 'Yes' : 'No', cellEditor: 'agRichSelectCellEditor', cellEditorParams: {
      values: ['Yes', 'No']
    } }
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true
  };
  public rowData?: any[];
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  onGridReady(params: GridReadyEvent) {
    fetch(`${API_URL}/Product/getAllActiveProducts`)
    .then(resp => resp.json())
    .then(resp => {
      this.rowData = resp
    })
  }
  getContextMenuItems(params: GetContextMenuItemsParams) : (string | MenuItemDef)[] {
    var result: (string | MenuItemDef)[] = [
      {
        name: 'Add New Product',
        action: () => {
          window.location.href = '/product/add'
        }
      },
      {
        name: 'Edit This Product',
        action: () => {
          window.location.href = `/product/edit/${params.node?.data?.productId}`
        },
        disabled: !params.node?.data.productId
      },
      {
        name: `Remove ${params.node?.data?.name}`,
        action: () => {
          Swal.fire({ 
            title: 'Are you sure?', 
            text: `Are you sure you want to delete ${params.node?.data?.name}?` ,
            cancelButtonColor: 'green',
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonColor: 'red',
            confirmButtonText: 'Yes',
            focusCancel: true,
            icon: 'question'
          }).then(resp => {
            if(!resp.isConfirmed) return;
            fetch(`${API_URL}/Product/removeProduct?productId=${params.node?.data?.productId}`, {
              method: 'DELETE', 
              headers: { 'Content-Type': 'application/json' }
            })
            .then(resp => {
              if(resp.status === 200)
                Swal.fire({ title: 'Success', text: `${params.node?.data?.name} has been deleted successfully`, icon: 'success' })
              .then(() => window.location.reload())
              else
                Swal.fire({ title: 'Error', text: 'An error occured while trying to delete the product.', icon:'error' })
            }).catch(() => Swal.fire({ title: 'Error', text: 'An error occured while trying to delete the product.', icon:'error' }))
          })
        }
      },
      ...(params.defaultItems ?? [])
    ];
    return result;
  }
}
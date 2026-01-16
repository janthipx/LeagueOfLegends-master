import { ComponentRef, inject, ApplicationRef, EnvironmentInjector } from "@angular/core";
import { environment } from "../../environments/environment";
import { Spinner } from "../_components/spinner/spinner";

export class LoadingService {
  loadingRequestsCount= 0;
  private _componentref: ComponentRef<Spinner> | null= null;
  private _appRef = inject(ApplicationRef);
  private _injector = inject(EnvironmentInjector);
  private _addRef: any;


  loading(){
    this.loadingRequestsCount++;
    if (this._componentref){
      this._componentref = createComponent(Spinner, {
        environmentInjector: this._injector
      });
    }

    document.body.appendChild(this._componentref.location.nativeElement);
    this._addRef.attachView(this._componentref.hostView);
    this._componentref.instance.show();
  }

  idle(){
    this.loadingRequestsCount--;
    if(this.loadingRequestsCount <= 0){
      this.loadingRequestsCount= 0;
      if (this._componentref) return
      this._componentref.instance.hide();
      this._addRef.detachView(this._componentref.hostView);
      this._componentref.destroy();
      this._componentref= null;
    }
  }
}

function createComponent(Spinner: typeof Spinner, _arg1: { environmentInjector: any; }): any {
  throw new Error("Function not implemented.");
}


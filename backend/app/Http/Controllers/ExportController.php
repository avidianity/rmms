<?php

namespace App\Http\Controllers;

use App\Exports\BabyExport;
use App\Exports\ImmunizationExport;
use App\Exports\InventoryExport;
use App\Exports\MedicineExport;
use App\Exports\PatientExport;
use App\Exports\PrenatalRecordExport;
use App\Exports\RegularRecordExport;
use Maatwebsite\Excel\Excel;

class ExportController extends Controller
{
    public function patients()
    {
        return (new PatientExport())->download('patients.pdf', Excel::MPDF);
    }

    public function regularRecords()
    {
        return (new RegularRecordExport())->download('regular-records.pdf', Excel::MPDF);
    }

    public function prenatalRecords()
    {
        return (new PrenatalRecordExport())->download('prenatal-records.pdf', Excel::MPDF);
    }

    public function babies()
    {
        return (new BabyExport())->download('babies.pdf', Excel::MPDF);
    }

    public function immunizations()
    {
        return (new ImmunizationExport())->download('immunization-records.pdf', Excel::MPDF);
    }

    public function inventories()
    {
        return (new InventoryExport())->download('supplies.pdf', Excel::MPDF);
    }

    public function medicines()
    {
        return (new MedicineExport())->download('medicines.pdf', Excel::MPDF);
    }
}

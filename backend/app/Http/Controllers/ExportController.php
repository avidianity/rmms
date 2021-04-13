<?php

namespace App\Http\Controllers;

use App\Exports\BabyExport;
use App\Exports\ImmunizationExport;
use App\Exports\InventoryExport;
use App\Exports\MedicineExport;
use App\Exports\PatientExport;
use App\Exports\PrenatalRecordExport;
use App\Exports\RegularRecordExport;

class ExportController extends Controller
{
    public function patients()
    {
        return (new PatientExport())->download('patients.xlsx');
    }

    public function regularRecords()
    {
        return (new RegularRecordExport())->download('regular-records.xlsx');
    }

    public function prenatalRecords()
    {
        return (new PrenatalRecordExport())->download('prenatal-records.xlsx');
    }

    public function babies()
    {
        return (new BabyExport())->download('babies.xlsx');
    }

    public function immunizations()
    {
        return (new ImmunizationExport())->download('immunization-records.xlsx');
    }

    public function inventories()
    {
        return (new InventoryExport())->download('supplies.xlsx');
    }

    public function medicines()
    {
        return (new MedicineExport())->download('medicines.xlsx');
    }
}

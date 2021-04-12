<?php

namespace App\Exports;

use App\Models\Medicine;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class MedicineExport implements FromCollection, WithHeadings
{
    use Exportable;

    private $fileName = 'medicines.pdf';

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Medicine::latest()
            ->get()
            ->map(function ($row) {
                $data = $row->toArray();
                $data['created_at'] = Carbon::parse($row->created_at)->format('F d, Y h:i A');
                $data['updated_at'] = Carbon::parse($row->updated_at)->format('F d, Y h:i A');

                return $data;
            });
    }

    public function headings(): array
    {
        return array_keys($this->collection()->first());
    }
}

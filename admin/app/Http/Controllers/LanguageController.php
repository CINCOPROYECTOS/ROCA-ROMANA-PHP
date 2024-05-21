<?php

namespace App\Http\Controllers;

use App\Models\Language;
use App\Models\Setting;
use App\Services\BootstrapTableService;
use App\Services\ResponseService;
use Illuminate\Contracts\Session\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Session as FacadesSession;
use Throwable;

class LanguageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $language_count = Language::count();

        if ($language_count == 0) {
            $lang = new Language();
            $lang->name = "English";
            $lang->code = "en";
            $lang->file_name = "en.json";
            $lang->status = 1;
            $lang->save();
        }
        return view('settings.language');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        if (!has_permissions('create', 'language')) {
            return redirect()->back()->with('error', PERMISSION_ERROR_MSG);
        }
        $request->validate([
            'name' => 'required',
            'code' => 'required|unique:languages',
        ]);
        $language = new Language();
        $language->name = $request->name;
        $language->code = $request->code;
        $language->status = 0;
        $language->rtl = $request->rtl == "true" ? true : false;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = $request->code . '.' . $file->getClientOriginalExtension();
            $file->move(base_path('public/languages/'), $filename);
            $language->file_name = $filename;
        }
        if ($request->hasFile('file_for_web')) {
            $file = $request->file('file_for_web');
            $filename = $request->code . '.' . $file->getClientOriginalExtension();
            $file->move(base_path('public/web_languages/'), $filename);
            $language->file_name = $filename;
        }
        if ($request->hasFile('file_for_panel')) {
            $file = $request->file('file_for_panel');
            $filename = $request->code . '.' . $file->getClientOriginalExtension();
            $file->move(base_path('resources/lang/'), $filename);
            $language->file_name = $filename;
        }
        $language->save();
        ResponseService::successRedirectResponse('Language Successfully Added');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {

        $offset = $request->input('offset', 0);
        $limit = $request->input('limit', 10);
        $sort = $request->input('sort', 'id');
        $order = $request->input('order', 'ASC');

        $sql = Language::orderBy($sort, $order);
        // dd($sql->toArray());


        if (isset($_GET['search']) && !empty($_GET['search'])) {
            $search = $_GET['search'];
            $sql->where('id', 'LIKE', "%$search%")->orwhere('code', 'LIKE', "%$search%")->orwhere('name', 'LIKE', "%$search%");
        }

        $total = $sql->count();

        if (isset($_GET['limit'])) {
            $sql->skip($offset)->take($limit);
        }


        $res = $sql->get();
        // return $res;
        $bulkData = array();
        $bulkData['total'] = $total;
        $rows = array();
        $tempRow = array();
        $count = 1;
        $operate = '';
        foreach ($res as $row) {
            $defaultLanguageCode = system_setting('default_language');
            $tempRow = $row->toArray();
            $tempRow['rtl'] = $row->rtl ? "Yes" : "No";
            $tempRow['file'] = '<a href=' . url('languages/' . $row->code . '.json') . '>' . 'View File' . '</a>';
            $tempRow['panel_file'] = '<a href=' . url('lang/en.json') . '>' . 'View File' . '</a>';
            $ids = isset($row->parameter_types) ? $row->parameter_types : '';
            $operate = BootstrapTableService::editButton('', true, null, null, $row->id, null);
            if(isset($defaultLanguageCode) && !empty($defaultLanguageCode)){
                if($defaultLanguageCode != $row->code){
                    $operate .= BootstrapTableService::deleteButton(route('language.destroy', $row->id), $row->id);
                }
            }
            $tempRow['operate'] = $operate;
            $rows[] = $tempRow;
            $count++;
        }

        $bulkData['rows'] = $rows;
        return response()->json($bulkData);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        // dd($request->toArray());
        if (!has_permissions('update', 'language')) {
            return redirect()->back()->with('error', PERMISSION_ERROR_MSG);
        }
        $request->validate([
            'edit_language_name' => 'required',
            // 'edit_language_code' => 'required|unique:languages,'.$request->edit_id.',id',
            'edit_language_code' => 'required|unique:languages,code,'.$request->edit_id.',id',
        ]);
        $language = Language::find($request->edit_id);
        $language->name = $request->edit_language_name;
        $language->code = $request->edit_language_code;
        $language->status = 0;
        $language->rtl = $request->edit_rtl == "on" ? true : false;

        if ($request->hasFile('edit_json')) {


            $file = $request->file('edit_json');

            $filename = $request->edit_language_code . '.' . $file->getClientOriginalExtension();
            if ($file->getClientOriginalExtension() != 'json') {
                return back()->with('error', 'Invalid File Type');
            }
            if (file_exists(base_path('public/languages/') . $filename)) {
                File::delete(base_path('public/languages/'), $filename);
            }
            $file->move(base_path('public/languages/'), $filename);
            $language->file_name = $filename;
        }
        if ($request->hasFile('edit_json_admin')) {


            $file = $request->file('edit_json_admin');


            $filename = $request->edit_language_code . '.json';

            if ($file->getClientOriginalExtension() != 'json') {


                return redirect()->back()->with('success', 'Invalid File');
            }
            if (file_exists(base_path('resources/lang/') . $filename)) {


                File::delete(base_path('resources/lang/'), $filename);
            }
            $file->move(base_path('resources/lang/'), $filename);
            $language->file_name = $filename;
        }


        if ($request->hasFile('edit_json_web')) {


            $file = $request->file('edit_json_web');
            $filename = $request->edit_language_code . '.' . $file->getClientOriginalExtension();
            if ($file->getClientOriginalExtension() != 'json') {
                return redirect()->back()->with('error', 'Invalid File Type');
            }
            if (file_exists(base_path('public/web_languages/') . $filename)) {
                File::delete(base_path('public/web_languages/'), $filename);
            }
            $file->move(base_path('public/web_languages/'), $filename);
            $language->file_name = $filename;
        }


        $language->save();
        ResponseService::successRedirectResponse('Language Updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        if (!has_permissions('delete', 'language')) {
            return redirect()->back()->with('error', PERMISSION_ERROR_MSG);
        } else {
            $language = Language::find($id);

            if ($language->delete()) {
                if ($language->title_image != '') {
                    if (file_exists(base_path('public/languages/'), $language->file)) {
                        unlink(base_path('public/languages/'), $language->file);
                    }
                }


                return redirect()->back()->with('success', 'Language Deleted Successfully');
            } else {
                return redirect()->back()->with('error', 'Something Wrong');
            }
        }
    }
    public function set_language(Request $request)
    {
        FacadesSession::put('locale', $request->lang);
        $language = Language::where('code',$request->lang)->first();
        FacadesSession::put('language', $language);
        FacadesSession::save();
        app()->setLocale(FacadesSession::get('language'));
        // dd($request->lang);
        // FacadesSession::put('locale', $request->lang);
        // $language = Language::where('code', $request->lang)->first();
        // FacadesSession::save();
        // FacadesSession::put('language', $language);
        // app()->setLocale(FacadesSession::get('locale'));
        return redirect()->back();
    }
    public function downloadPanelFile()
    {

        $file = base_path("resources/lang/en.json");
        $filename = 'admin_panel_en.json';

        return Response::download($file, $filename, [
            'Content-Type' => 'application/json',
        ]);
    }
    public function downloadAppFile()
    {
        $file = public_path("languages/en.json");
        $filename = 'app_en.json';

        return Response::download($file, $filename, [
            'Content-Type' => 'application/json',
        ]);
    }
    public function downloadWebFile()
    {
        $file = public_path("web_languages/en.json");

        $filename = 'web_en.json';

        return Response::download($file, $filename, [
            'Content-Type' => 'application/json',
        ]);
    }
}


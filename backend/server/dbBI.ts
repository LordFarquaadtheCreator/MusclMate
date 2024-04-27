import { Client } from "pg";

export async function get_exercise_by_uid(client: Client, uid: string): Promise<Array<any> | undefined>{
    const sql: string = "SELECT * FROM public.exercises WHERE uid = $1;"; 
    const values = [uid];

    try{
        const res = await client.query(sql, values);
        return res.rows;
    } catch(err) {
        console.error("Problem fetching\n", err);
        return undefined;
    }
}

export async function create_exercise(client: Client, item_name: string, target: string, reps: Number, sets: Number, keywords: string[], weight: Number): Promise<string | null>{
    const sql: string = `INSERT INTO public.exercises (uid, exercise_name, exercise_target, n_reps, n_sets,` +
                        ` arr_keywords, weight) VALUES (uuid_generate_v4(), $1, $2,` +
                        ` $3, $4, $5, $6) RETURNING uid`;
    const values = [item_name, target, reps.toString(), sets.toString(), keywords, weight.toString()]

    try{
        const result = await client.query(sql, values);
        const uid = result.rows[0].uid;
        return uid;
    } catch(err) {
        console.error("Problem creating new exercise\n", err);
        return null;
    }
}

export async function delete_from(client: Client, table_name: String, uid: String){
    const sql: string = `DELETE FROM public.${table_name} WHERE uid = $1`;
    const values = [uid];

    try{
        await client.query(sql, values);
        return true;
    } catch(err){
        console.error("Problem deleting new exercise\n", err);
        return false;
    }
}

/**
 * edit a row in exercise with given value
 * new_value must be the in the same structure as what was returned from get()
 * @param client client instance
 * @param new_value object representing all updated values
 * @param 
 */
export async function edit_exercise(client: Client, uid: String, new_value: Object){
    const sql: string = `UPDATE? public.exercises (uid, exercise_name, exercise_target, 
                        n_reps, n_sets, arr_keywords, weight) VALUES $1 WHERE uid = $2` ;
    const values = [uid, new_value];

    try{
        await client.query(sql, values);
        return true;
    } catch(err){
        console.error("Problem creating new exercise\n", err);
        return false;
    }

}
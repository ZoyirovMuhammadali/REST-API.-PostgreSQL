const {Router}=require('express')
const pool=require('../config/db')
const router=Router()


router.get('/', async(req,res)=>{
    try {
       
        const employers=await pool.query(`SELECT * FROM employee`)
        res.status(200).json(employers.rows)
    } catch (error) {
        console.log("xatolik wu yerda",error);
        //res.status(500).json({message:error.message})
    }
})

router.get('/:id', async(req,res)=>{
    try {
        
        const employer=await pool.query(`
        SELECT * FROM employee LEFT JOIN job ON job.id = employee.job_id WHERE employee.id=$1
        `, [req.params.id])
        res.status(200).json(employer.rows[0])

    } catch (error) {
        console.log("xatolik wu yerda",error);
    }
})

router.post('/add',async(req,res)=>{
    try {
        const{name,salary,degree,job_id}=req.body
        const newEmployer=await pool.query(`
        INSERT INTO employee (name, degree, salary, job_id) VALUES ($1,$2,$3,$4) RETURNING *
        `,[name,degree,salary,job_id]);
        res.status(201).json(newEmployer.rows)

    } catch (error) {
        console.log("xatoooo",error);
        //res.status(500).json({message:error.message})
    }
})

router.put('/:id',async(req,res)=>{
    try {
        const {id}=req.params
        const{name,salary,degree,job_id}=req.body

        const oldEmployer=await pool.query('SELECT * FROM employee WHERE id = $1', [id]);

        const updateEmployer=await pool.query(`
        UPDATE employee SET name=$1, degree=$2, salary=$3, job_id=$4  WHERE id=$5 RETURNING *
        `,[ 
            name ?  name:oldEmployer.rows[0].name,
            degree ? degree:oldEmployer.rows[0].degree,
            salary ? salary:oldEmployer.rows[0].salary,
            job_id ? job_id:oldEmployer.rows[0].job_id,
            id
        ])
        res.status(201).json(updateEmployer.rows[0])

    } catch (error) {
        //console.log("xatoooo",error);
        res.status(500).json({message:error.message})
    }
})


router.delete('/:id', async(req,res)=>{
    try {
       await pool.query('DELETE FROM employee WHERE id=$1',[req.params.id]) 
       res.status(200).json({message:'O`chirildi..>>>'})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})


module.exports=router
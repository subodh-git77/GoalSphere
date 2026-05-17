import { PrismaClient, Role, UomType, GoalStatus, SubmissionStatus, ApprovalStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main(){
  await prisma.notification.deleteMany(); await prisma.escalation.deleteMany(); await prisma.auditLog.deleteMany(); await prisma.quarterlyCheckin.deleteMany(); await prisma.goal.deleteMany(); await prisma.sharedGoal.deleteMany(); await prisma.goalCycle.deleteMany(); await prisma.user.deleteMany();
  const password = await bcrypt.hash('Password@123', 10);
  const admin = await prisma.user.create({data:{employeeId:'ADM001',name:'Ananya HR',email:'admin@goalsphere.com',password,role:Role.ADMIN,department:'HR',designation:'HR Head'}});
  const managers = await Promise.all(['Aarav Mehta','Priya Singh','Rahul Verma'].map((name,i)=>prisma.user.create({data:{employeeId:`MGR00${i+1}`,name,email:`manager${i+1}@goalsphere.com`,password,role:Role.MANAGER,department:['Sales','Operations','Technology'][i],designation:'L1 Manager'}})));
  const employees=[] as any[];
  for(let i=1;i<=10;i++){ employees.push(await prisma.user.create({data:{employeeId:`EMP${String(i).padStart(3,'0')}`,name:['Kavya','Rohan','Neha','Vikram','Isha','Arjun','Meera','Dev','Tanya','Kabir'][i-1]+' Sharma',email:`employee${i}@goalsphere.com`,password,role:Role.EMPLOYEE,department:['Sales','Operations','Technology'][i%3],designation:'Associate',managerId:managers[i%3].id}})); }
  await prisma.goalCycle.createMany({data:[{name:'FY 2026 Goal Setting',phase:'GOAL_SETTING',startDate:new Date('2026-05-01'),endDate:new Date('2026-05-31'),isActive:true},{name:'FY 2026 Q1 Check-in',phase:'Q1',startDate:new Date('2026-07-01'),endDate:new Date('2026-07-31')},{name:'FY 2026 Q2 Check-in',phase:'Q2',startDate:new Date('2026-10-01'),endDate:new Date('2026-10-31')},{name:'FY 2026 Q3 Check-in',phase:'Q3',startDate:new Date('2027-01-01'),endDate:new Date('2027-01-31')},{name:'FY 2026 Annual',phase:'Q4_ANNUAL',startDate:new Date('2027-03-01'),endDate:new Date('2027-04-30')}]});
  const shared = await prisma.sharedGoal.create({data:{title:'Improve Customer Satisfaction Index',description:'Department-wide KPI for customer experience',targetValue:'90',thrustArea:'Customer Excellence',ownerId:managers[0].id}});
  for(const [idx,u] of employees.entries()){
    const g1=await prisma.goal.create({data:{userId:u.id,createdBy:u.id,thrustArea:'Business Growth',title:'Achieve quarterly revenue target',description:'Drive measurable business impact',uomType:UomType.NUMERIC_MIN,targetValue:'100',weightage:40,submissionStatus:SubmissionStatus.APPROVED,approvalStatus:ApprovalStatus.APPROVED,locked:true,status:GoalStatus.ON_TRACK}});
    await prisma.goal.create({data:{userId:u.id,createdBy:managers[0].id,thrustArea:shared.thrustArea,title:shared.title,description:shared.description,uomType:UomType.PERCENTAGE,targetValue:shared.targetValue,weightage:30,sharedGoalId:shared.id,submissionStatus:SubmissionStatus.APPROVED,approvalStatus:ApprovalStatus.APPROVED,locked:true,status:GoalStatus.ON_TRACK}});
    await prisma.goal.create({data:{userId:u.id,createdBy:u.id,thrustArea:'Process Excellence',title:'Reduce process turnaround time',uomType:UomType.NUMERIC_MAX,targetValue:'5',weightage:30,submissionStatus: idx<7?SubmissionStatus.SUBMITTED:SubmissionStatus.DRAFT,approvalStatus:ApprovalStatus.PENDING,locked:false}});
    await prisma.quarterlyCheckin.create({data:{goalId:g1.id,quarter:'Q1',plannedTarget:'25',actualAchievement:String(20+idx),status:GoalStatus.ON_TRACK,progressScore:(20+idx)/25*100,employeeComment:'Progress is on track with minor blockers.'}});
  }
  await prisma.notification.create({data:{userId:admin.id,title:'Welcome to GoalSphere',message:'Seed data is ready for demo.'}});
  console.log('Seed complete. Logins: admin@goalsphere.com / manager1@goalsphere.com / employee1@goalsphere.com, password Password@123');
}
main().finally(()=>prisma.$disconnect());

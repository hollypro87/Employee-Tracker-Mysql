const connection = require("./connection");

class DB {
    constructor(connection) {
        this.connection = connection;
    }

    findAllEmployees() {
        return this.connection.query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
        );
    }

    findAllPossibleManager(employeeId) {
        return this.connection.query(
            "SELECT id, first_name, last_name FROM employee WHERE id != ?", employeeId
        );
    }

    createEmployee(employee) {
        return this.connection.query("INSERT INTO employee SET ?", employee);
    }

    updateEmployeeRole(employeeId, roleId) {
        return this.connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [employeeId, roleId]);
    }

    updateEmployeeManager(employeeId, managerId) {
        return this.connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [managerId, employeeId]);
    }

    findAllRoles() {
        return this.connection.query(
            "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
        );
    }

    findAllDepartments() {
        return this.connection.query(
            "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
        );
    }

    createRole(role) {
        return this.connection.query("INSERT INTO role SET ?", role);
    }

    createDepartment(departmentId) {
        return this.connection.query("INSERT INTO department SET ?", department);
    }

    findAllByManager(managerId) {
        return this.connection.query(
            "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;", managerId
        );
    }

    findAllByDepartment(departmentId) {
        return this.connection.query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;", departmentId
        );
    }
}

module.exports = new DB(connection);
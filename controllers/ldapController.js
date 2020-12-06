const jwt = require('jsonwebtoken');
const ldap = require("ldapjs");
const { lauthenticate } = require('ldap-authentication')
let client = null;

const authenticate = (req, res) => {
    debugger;
    const serviceUsername = 'radar';
    const servicePassword = 'Test1234'
    const username = req.body.username;
    const password = req.body.password;

    let options = {
        ldapOpts: {
            url: 'ldap://ldapenterprisetest.turkcell.tgc:389',
            // tlsOptions: { rejectUnauthorized: false }
        },
        adminDn: `uid=${serviceUsername}, ou=SpecialUsers,dc=entp,dc=tgc`,
        adminPassword: servicePassword,
        userDn: `uid=${username},ou=People,o=Turkcell,dc=entp,dc=tgc`,
        userPassword: password,
        userSearchBase: 'dc=entp,dc=tgc',
        usernameAttribute: 'uid',
        username: username,
        // starttls: false
    };

        // options = {
        //     ldapOpts: {
        //     url: 'ldap://ldapenterprisetest.turkcell.tgc:389',
        //     // tlsOptions: { rejectUnauthorized: false }
        //     },
        //     userDn: `uid=${serviceUsername},ou=People,o=Turkcell,dc=entp,dc=tgc`,
        //     userPassword: servicePassword,
        //     userSearchBase: 'CN=471206_RADAR_ANALISTOPERASYON,OU=REVENUEASSURANCEDETECTIONANDREPORTING,ou=AppOU,ou=Groups,dc=entp,dc=tgc',
        //     usernameAttribute: 'uid',
        //     username: username
        //     // starttls: false
        // }



        (async () => {
            try {

                user = await lauthenticate(options)
                console.log(user)
                debugger;
            } catch (error) {
                debugger;
            }

        })
        ();



    if (!client) {
        client = ldap.createClient({
            url: 'ldap://ldapenterprisetest.turkcell.tgc:389'
        });
    }
    try {
        client.bind(`uid=${serviceUsername},ou=SpecialUsers,dc=entp,dc=tgc`, servicePassword, (err, result) => {
            try {
                if (err) {
                    console.error("ldap err", err);
                    res.json({ isSucess: false, message: err });
                }
                else {
                    const user = {
                        group: "analyst",
                        avatar: "https://images.discordapp.net/avatars/547905866255433758/6db57ae216790490f53cbd9e2a49d486.png?size=128",
                        name: "Selin Kaya",
                        username: username
                    };

                    const token = jwt.sign(user, "selin#kaya");
                    res.json({ token, user });
                }
            } catch (e) {
                console.error("ldap inner", e);
                res.status(400).json({ error: e });
            }

        });

        //client.search()
    } catch (error) {

    }


};

module.exports = {
    authenticate
}
const jwt = require('jsonwebtoken');
const ldap = require("ldapjs");
const assert = require('assert')
//const { lauthenticate } = require('ldap-authentication')
let client = null;

const authenticate = (req, res) => {
    
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
        //userDn: `uid=${username},ou=People,o=Turkcell,dc=entp,dc=tgc`,
        userPassword: password,
        userSearchBase: 'dc=entp,dc=tgc',
        usernameAttribute: 'uid',
        username: username,
        groupsSearchBase: {
            analyst: '471206_RADAR_ANALISTOPERASYON',
            business: '471206_RADAR_BUSINESSDEVELOPMENT'
        },
        //groupsSearchBase: 'ismemberof=CN=471206_RADAR_ANALIST,OU=REVENUEASSURANCEDETECTIONANDREPORTING,ou=AppOU,ou=Groups,dc=entp,dc=tgc',//'(memberOf=*)',//"CN=471206_RADAR_ANALISTOPERASYON,OU=REVENUEASSURANCEDETECTIONANDREPORTING,ou=AppOU,ou=Groups,dc=entp,dc=tgc",
        groupClass: 'groups'
    };

    (async () => {
        try {
            debugger;
            console.log('auth start');
            // lauthenticate.on("error", (err) => {
            //   console.error("err", err)
            // });
            user = await lauthenticate(options);
            user.username=options.username;
            if(user.groups.length) {
                console.log(user);
                const token = jwt.sign(user, "radar#secret");
                res.json({ token, user });    
            } else {
                res.status(403).json({ 
                    error : "User could not be found or unauthorized."
                 });    
            }
            debugger;
        } catch (error) {
            debugger;
        }

    })
    ();
/*
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
*/

};

async function lauthenticate(options) {
    if (!options.userDn) {
      assert(options.adminDn, 'Admin mode adminDn must be provided')
      assert(options.adminPassword, 'Admin mode adminPassword must be provided')
      assert(options.userSearchBase, 'Admin mode userSearchBase must be provided')
      assert(
        options.usernameAttribute,
        'Admin mode usernameAttribute must be provided'
      )
      assert(options.username, 'Admin mode username must be provided')
    } else {
      assert(options.userDn, 'User mode userDn must be provided')
    }
    assert(options.userPassword, 'userPassword must be provided')
    assert(
      options.ldapOpts && options.ldapOpts.url,
      'ldapOpts.url must be provided'
    )
    if (options.adminDn) {
      assert(
        options.adminPassword,
        'adminDn and adminPassword must be both provided.'
      )
      return await authenticateWithAdmin(
        options.adminDn,
        options.adminPassword,
        options.userSearchBase,
        options.usernameAttribute,
        options.username,
        options.userPassword,
        options.starttls,
        options.ldapOpts,
        options.groupsSearchBase,
        options.groupClass
      )
    }
    assert(options.userDn, 'adminDn/adminPassword OR userDn must be provided')
    return await authenticateWithUser(
      options.userDn,
      options.userSearchBase,
      options.usernameAttribute,
      options.username,
      options.userPassword,
      options.starttls,
      options.ldapOpts,
      options.groupsSearchBase,
      options.groupClass
    )
  }

// bind and return the ldap client
function _ldapBind(dn, password, starttls, ldapOpts) {
    return new Promise(function (resolve, reject) {
      ldapOpts.connectTimeout = ldapOpts.connectTimeout || 5000
      var client = ldap.createClient(ldapOpts)
      if (starttls) {
        client.starttls(ldapOpts.tlsOptions, null, function (error) {
          if (error) {
            reject(error)
            return
          }
          client.bind(dn, password, function (err) {
            if (err) {
              reject(err)
              client.unbind()
              return
            }
            ldapOpts.log && ldapOpts.log.trace('bind success!')
            resolve(client)
          })
        })
      } else {
        client.bind(dn, password, function (err) {
          if (err) {
            reject(err)
            client.unbind()
            return
          }
          ldapOpts.log && ldapOpts.log.trace('bind success!')
          resolve(client)
        })
      }
    })
  }
  
  // search a user and return the object
  async function _searchUser(
    ldapClient,
    searchBase,
    usernameAttribute,
    username
  ) {
    return new Promise(function (resolve, reject) {
      var filter = new ldap.filters.EqualityFilter({
        attribute: usernameAttribute,
        value: username,
      })
      ldapClient.search(
        searchBase,
        {
          filter: filter,
          scope: 'sub',
        },
        function (err, res) {
          var user = null
          if (err) {
            reject(err)
            ldapClient.unbind()
            return
          }
          res.on('searchEntry', function (entry) {
            user = entry.object
          })
          res.on('searchReference', function (referral) {
            console.log('referral: ' + referral.uris.join())
          })
          res.on('error', function (err) {
            reject(err)
            ldapClient.unbind()
          })
          res.on('end', function (result) {
            if (result.status != 0) {
              reject(new Error('ldap search status is not 0, search failed'))
            } else {
              resolve(user)
            }
            ldapClient.unbind()
          })
        }
      )
    })
  }
  
  // search a groups which user is member
  async function _searchUserGroups(ldapClient, searchBase, user, groupClass) {

    var groups = [];
    //1. searchBase.analyst
    var role1 = await _hasRaUserGroup(
        ldapClient,
        searchBase.analyst,
        'RADAR_ANALISTOPERASYON',
        user,
        groupClass
      );
    if (role1)
        groups.push(role1);
    //2. searchBase.business
    var role2 = await _hasRaUserGroup(
        ldapClient,
        searchBase.business,
        'RADAR_BUSINESSDEVELOPMENT',
        user,
        groupClass
      );
    if (role2)
        groups.push(role2);
    ldapClient.unbind()
    return groups;
  }
  
  async function _hasRaUserGroup(ldapClient, groupName, rolName, user, groupClass) {
    return new Promise(function (resolve, reject) {
        console.log('search user groups started');
      ldapClient.search(
        user.dn,
        {
            scope: 'sub',
            filter: 'ismemberof=CN=' + groupName + ',OU=REVENUEASSURANCEDETECTIONANDREPORTING,ou=AppOU,ou=Groups,dc=entp,dc=tgc',
        },
        function (err, res) {
          if (err) {
            reject(err)
            ldapClient.unbind()
            return
          }
          res.on('searchEntry', function (entry) {
            resolve(rolName)
          })
          res.on('searchReference', function (referral) {
            console.log('referral: ' + referral.uris.join())
          })
          res.on('error', function (err) {
            reject(err)
            ldapClient.unbind()
          })
          res.on('end', function (result) {
            if (result.status != 0) {
              reject(new Error('ldap search status is not 0, search failed'))
            } else {
                console.log(result.status + " group found");
                resolve("");
            }
            //ldapClient.unbind()
          })
        }
      )
    })
  }

  async function authenticateWithAdmin(
    adminDn,
    adminPassword,
    userSearchBase,
    usernameAttribute,
    username,
    userPassword,
    starttls,
    ldapOpts,
    groupsSearchBase,
    groupClass
  ) {
    var ldapAdminClient
    try {
      ldapAdminClient = await _ldapBind(
        adminDn,
        adminPassword,
        starttls,
        ldapOpts
      )
    } catch (error) {
      throw { admin: error }
    }
    console.log('app admin client ok');
    var user = await _searchUser(
      ldapAdminClient,
      userSearchBase,
      usernameAttribute,
      username
    );
    console.log('user found');
    ldapAdminClient.unbind()
    if (!user || !user.dn) {
      ldapOpts.log &&
        ldapOpts.log.trace(
          `admin did not find user! (${usernameAttribute}=${username})`
        )
      throw new LdapAuthenticationError(
        'user not found or usernameAttribute is wrong'
      )
    }
    var userDn = user.dn
    let ldapUserClient
    try {
      ldapUserClient = await _ldapBind(userDn, userPassword, starttls, ldapOpts)
    } catch (error) {
      throw error
    }
    ldapUserClient.unbind()
    if (groupsSearchBase && groupClass) {
      try {
        ldapAdminClient = await _ldapBind(
          adminDn,
          adminPassword,
          starttls,
          ldapOpts
        )
      } catch (error) {
        throw error
      }
      console.log('get user role groups');
      var groups = await _searchUserGroups(
        ldapAdminClient,
        groupsSearchBase,
        user,
        groupClass
      )
      console.log('groups found:' + groups)
      user.groups = groups
      ldapAdminClient.unbind()
    }
    return user
  }
  
  async function authenticateWithUser(
    userDn,
    userSearchBase,
    usernameAttribute,
    username,
    userPassword,
    starttls,
    ldapOpts,
    groupsSearchBase,
    groupClass
  ) {
    let ldapUserClient
    try {
      ldapUserClient = await _ldapBind(userDn, userPassword, starttls, ldapOpts)
    } catch (error) {
      throw error
    }
    if (!usernameAttribute || !userSearchBase) {
      // if usernameAttribute is not provided, no user detail is needed.
      ldapUserClient.unbind()
      return true
    }
    var user = await _searchUser(
      ldapUserClient,
      userSearchBase,
      usernameAttribute,
      username
    )
    if (!user || !user.dn) {
      ldapOpts.log &&
        ldapOpts.log.trace(
          `user logged in, but user details could not be found. (${usernameAttribute}=${username}). Probabaly wrong attribute or searchBase?`
        )
      throw new LdapAuthenticationError(
        'user logged in, but user details could not be found. Probabaly usernameAttribute or userSearchBase is wrong?'
      )
    }
    if (groupsSearchBase && groupClass) {
      var groups = await _searchUserGroups(
        ldapUserClient,
        groupsSearchBase,
        user,
        groupClass
      )
      user.groups = groups
      ldapUserClient.unbind()
    }
    return user
  }
    
  class LdapAuthenticationError extends Error {
    constructor(message) {
      super(message)
      // Ensure the name of this error is the same as the class name
      this.name = this.constructor.name
      // This clips the constructor invocation from the stack trace.
      // It's not absolutely essential, but it does make the stack trace a little nicer.
      //  @see Node.js reference (bottom)
      Error.captureStackTrace(this, this.constructor)
    }
  }

module.exports = {
    authenticate
}